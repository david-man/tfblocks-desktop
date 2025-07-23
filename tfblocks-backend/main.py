from flask import Flask, request, jsonify, send_file
from flask_cors import CORS, cross_origin
from data_parsing import parse_json
from model_runner import build_model
import io
import numpy as np
import os
import shutil
import sys

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": ["http://localhost:5173"]}}, supports_credentials=True)
latest_model = None

@app.route('/api/sendModel/', methods = ["POST"])
def receive_data():
    data = request.get_json()
    input_shape, networks, network_compile_order, input_handle_dict, output_handle_dict, type_map, property_map, dependency_map = parse_json(data)

    try:
        model, model_result = build_model(input_shape, networks, network_compile_order, input_handle_dict, output_handle_dict, type_map, property_map, dependency_map)
        latest_model = model
        return jsonify({"message": f"Model compilation succeeded!"}), 200
    except Exception as e:
        return jsonify({'message': f"Model compilation failed. Sorry!"}), 400
@app.route('/api/getMatrixShape/', methods = ['POST'])
def getInputShape():
    file = request.get_json().get('file_path')
    type_ = request.get_json().get('type')
    try:
        loaded_array = np.load(file)
        if(type_ == 'input' or type_ == 'output'):
            return jsonify({'data_shape': loaded_array.shape[1:]}), 200
        else:
            return jsonify({'data_shape': loaded_array.shape}), 200
    except:
        return jsonify({'message': 'input invalid'}), 400

if __name__ == '__main__':
    app.run(host='localhost', port=8080, debug = True)
    #gunicorn main:app