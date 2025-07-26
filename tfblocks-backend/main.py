from flask import Flask, request, jsonify
from flask_cors import CORS
from data_parsing import parse_json
from model_runner import build_model
import numpy as np
from keras.callbacks import Callback
import threading
import keras
import socket
from contextlib import closing

def find_free_port():
    with closing(socket.socket(socket.AF_INET, socket.SOCK_STREAM)) as s:
        s.bind(('', 0))  # Binds to an ephemeral (randomly assigned) port
        s.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        return s.getsockname()[1]  # Returns the port number


app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True)
compiled_model = None
latest_model = None
input_data = None
output_data = None
training_thread = None

class TrainingCallback(Callback):
    def __init__(self):
        super().__init__()
        self.epochs = 0
        self.latest_error = 'N/A'
        self.validation_error = 'N/A'

    def on_epoch_end(self, epoch, logs=None):
        # Here you can implement any logic you want to run at the end of each epoch
        if logs is not None:
            self.epochs = epoch + 1
            self.latest_error = logs.get('loss', 'N/A')
            self.validation_error = logs.get('val_loss', 'N/A')
    
    def on_batch_end(self, batch, logs=None):
        global latest_model
        if self.model:
            latest_model = self.model

    def on_train_end(self):
        global latest_model
        if self.model:
            latest_model = self.model

    def force_end_training(self):
        global latest_model
        if self.model:
            latest_model = self.model
        self.model.stop_training = True
    
training_callback = TrainingCallback()

def train(epochs, train_test_split, batch_size):
    global compiled_model, input_data, output_data, training_callback
    compiled_model.fit(input_data, output_data, epochs=epochs, verbose=0, 
                     validation_split=train_test_split, batch_size=batch_size,
                     shuffle=True, callbacks=[training_callback])

@app.route('/api/sendModel/', methods = ["POST"])
def receive_data():
    global compiled_model
    data = request.get_json()
    input_shape, networks, network_compile_order, input_handle_dict, output_handle_dict, type_map, property_map, dependency_map = parse_json(data)

    try:
        model, model_result = build_model(input_shape, networks, network_compile_order, input_handle_dict, output_handle_dict, type_map, property_map, dependency_map)
        compiled_model = model
        return jsonify({'message': f"Model compilation succeeded!"}), 200
    except Exception as e:
        return jsonify({'message': f"Model compilation failed. Sorry!"}), 400
@app.route('/api/getMatrixShape/', methods = ['POST'])
def getInputShape():
    global input_data, output_data
    file = request.get_json().get('file_path')
    type_ = request.get_json().get('type')
    try:
        loaded_array = np.load(file)
        if(type_ == 'input'):
            input_data = loaded_array
            return jsonify({'data_shape': loaded_array.shape[1:]}), 200
        elif(type_ == 'output'):
            output_data = loaded_array
            return jsonify({'data_shape': loaded_array.shape[1:]}), 200
        else:
            return jsonify({'data_shape': loaded_array.shape}), 200
    except:
        return jsonify({'message': 'input invalid'}), 400

@app.route('/api/trainModel/', methods = ['POST'])
def trainModel():
    data = request.get_json()
    global compiled_model, latest_model, input_data, output_data
    if not compiled_model or (input_data is None) or (output_data is None):
        return jsonify({'message': 'Model not found'}), 400
    try:
        global training_thread
        if training_thread and training_thread.is_alive():
            return jsonify({'message': 'Training already in progress'}), 400
        else:
            optimizer = None
            if(data['optimizer'] == 'adam'):
                optimizer = keras.optimizers.Adam(learning_rate=data['eta'])
            elif(data['optimizer'] == 'sgd'):
                optimizer = keras.optimizers.SGD(learning_rate=data['eta'])
            elif(data['optimizer'] == 'rmsprop'):
                optimizer = keras.optimizers.RMSprop(learning_rate=data['eta'])
            else:
                return jsonify({'message': 'Invalid optimizer'}), 400

            loss = None
            metrics = []
            if(data['loss'] == 'mse'):
                loss = 'mean_squared_error'
                metrics = ['accuracy']
            elif(data['loss'] == 'crossentropy'):
                if output_data.ndim == 2:
                    loss = 'binary_crossentropy'
                    metrics = ['binary_accuracy']
                else:
                    loss = 'categorical_crossentropy'
                    metrics = ['categorical_accuracy']
            else:
                return jsonify({'message': 'Invalid loss function'}), 400
            compiled_model.compile(optimizer=optimizer, loss=loss, metrics=metrics)
            training_thread = threading.Thread(target=train, args=(data['epochs'], data['ttsplit'], data['batch_size']))
            training_thread.start()
            return jsonify({'message': 'success'}), 200
    except Exception as e:
        return jsonify({'message': str(e)}), 400
    
@app.route('/api/getTrainingLogs/', methods = ['GET'])
def getTrainingLogs():
    global training_callback, training_thread
    if(training_thread.is_alive()):
        return jsonify({'training_complete': False,
                        'epochs': training_callback.epochs,
                        'val_loss': training_callback.validation_error,
                        'loss': training_callback.latest_error}), 200
    else:
        return jsonify({'training_complete': True,
                        'epochs': training_callback.epochs,
                        'val_loss': training_callback.validation_error,
                        'loss': training_callback.latest_error}), 200

@app.route('/api/forceTrainingEnd/', methods = ['POST'])
def forceTrainingEnd():
    global training_callback, latest_model
    if training_thread and training_thread.is_alive():
        training_callback.force_end_training()
        training_thread.join()
        return jsonify({'message': 'Training forcibly ended',
                        'model saved': (latest_model is not None)}), 200
    else:
        return jsonify({'message': 'No training in progress',
                        'model saved': (latest_model is not None)}), 200

@app.route('/api/saveLatestModel/', methods = ['POST'])
def saveLatestModel():
    global latest_model
    data = request.get_json()
    if 'folder_path' in data:
        folder_path = data['folder_path']
        if latest_model is not None:
            try:
                latest_model.save(folder_path + '/tfblocks_model.keras')
                return jsonify({'message': 'Model saved successfully'}), 200
            except Exception as e:
                return jsonify({'message': f'Error saving model: {str(e)}'}), 400
        else:
            return jsonify({'message': 'No model to save'}), 200
if __name__ == '__main__':
    port = find_free_port()
    print("PORTNUM: ", port)
    app.run(host='localhost', port=port, debug = True)
    
    #gunicorn main:app