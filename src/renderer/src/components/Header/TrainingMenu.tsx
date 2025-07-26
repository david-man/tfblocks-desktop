import { useState } from "react";
import InputComponent from "../Graph/NodeOptions/NumericalInputComponent";
import axios from "axios";
import Link from "@renderer/link";
import portController from "@renderer/controllers/portController";

const TrainingMenu = (props : any) => {
    const {get_port} = portController()
    const [batchSize, setBatchSize] = useState<number>(16);
    const epochs = props.epochs
    const [eta, setEta] = useState<number>(0.0001);
    const ttsplit = props.ttsplit
    const [optimizer, setOptimizer] = useState<string>('adam');
    const [loss, setLoss] = useState<string>('mse');
    const handleOptimizerChange : any = (event) => {
            const val = (event.target as HTMLSelectElement).value
            setOptimizer(val ? val : '')
        }
    const handleLossChange : any = (event) => {
            const val = (event.target as HTMLSelectElement).value
            setLoss(val ? val : '')
        }
    return (
        <>
        <div className = 'absolute w-full h-full z-10 flex flex-col justify-center items-center'>
            <div className = ' border-black rounded-2xl w-95/100 h-95/100 bg-gray-500 opacity-70 flex flex-col'>
            </div>
        </div>
        <div className = 'absolute w-full h-full z-11 flex flex-col justify-center items-center'>
            <div className = 'w-95/100 h-95/100 overflow-y-auto flex flex-col items-center'>
                <p className = 'text-[100px] text-white text-center p-[30px]'>Training!</p>
                <p className = 'text-[20px] text-white text-center p-[10px]'>Training is the process by which your model <i>learns</i> the patterns in your data by adjusting based on its current performance on the data.</p>
                <p className = 'text-[20px] text-white text-center p-[10px]'>It does this through a sophisticated process called <i>backpropagation</i>.</p>
                <p className = 'text-[20px] text-white text-center p-[10px]'>This is a process that involves proportionally adjusting its neurons based on the performance <i>and</i> how much each neuron individually contributed to that performance.</p>
                <p className = 'text-[20px] text-white text-center p-[10px]'>Luckily, we and Keras handle all that for you. Here are the settings you have to worry about.</p>
                <div className = 'border-white border-4 rounded-4xl grid grid-cols-2 grid-rows-3 min-h-fit w-8/10 p-[10px]'>
                    <div className = 'flex flex-col h-[250px] justify-center items-center'>
                        <InputComponent borderColor = {'border-white'} textColor = {'text-white'} id = {'training_batch'} 
                        value = {batchSize} label = 'Batch Size' setFunction = {setBatchSize} 
                        textSize = {'text-[30px]'} fieldSize = {'w-[60px]'} allowNegative = {false}/>
                        <div className = 'text-[14px] text-white m-[10px] border-2 rounded-2xl p-[5px] h-8/10 overflow-y-auto w-8/10'>
                            <ol className = 'list-disc list-inside'>
                                <li>Batch size tells tfBlocks how many large a batch should be. A batch size of 0 is considered as you not wanting to use batches.</li>
                                <li>Batches are similar to telling a student how many practice questions they should try before checking the answers and adjusting.</li>
                                <li>Like in real life, models often learn and adapt faster if they batch multiple inputs before adjusting.</li>
                                <li>However, a batch size that is too large will lead to instability.</li>
                                <li>Conventional batch sizes are 8, 16, 32, and 64.</li>
                            </ol>
                        </div>
                    </div>
                    <div className = 'flex flex-col h-[250px] justify-center items-center'>
                        <InputComponent borderColor = {'border-white'} textColor = {'text-white'} id = {'training_epochs'} 
                        value = {epochs} label = 'Epochs' setFunction = {props.setEpochs} 
                        textSize = {'text-[30px]'} fieldSize = {'w-[100px]'}/>
                        <div className = 'text-[14px] text-white m-[10px] border-2 rounded-2xl p-[5px] h-8/10 overflow-y-auto w-8/10'>
                            <ol className = 'list-disc list-inside'>
                                <li>Epochs tells tfBlocks how many times the model go through the entire training data.</li>
                                <li>It's similar to telling a student how many whole practice tests they should take.</li>
                                <li>Not enough epochs(underfitting), and the student isn't ready for the test.</li>
                                <li>Too many epochs(overfitting), and the student begins memorizing problems instead of learning the material.</li>
                            </ol>
                        </div>
                        
                    </div>
                    <div className = 'flex flex-col h-[250px] justify-center items-center'>
                        <InputComponent borderColor = {'border-white'} textColor = {'text-white'} id = {'training_eta'} 
                        value = {eta} label = 'Learning Rate' setFunction = {setEta} 
                        textSize = {'text-[30px]'} fieldSize = {'w-[140px]'} allowDecimal = {true}
                        filter = {(input) => {
                            if(input == '')
                            {
                                return 0;
                            }
                            return input - Math.floor(input);
                            }}/>
                        <div className = 'text-[14px] text-white m-[10px] border-2 rounded-2xl p-[5px] h-8/10 overflow-y-auto w-8/10'>
                            <ol className = 'list-disc list-inside'>
                                <li>Learning Rate tells tfBlocks how much the model should adjust after checking its answers and seeing how "wrong" they were.</li>
                                <li>Too low, and the model might never learn.</li>
                                <li>Too high, and the model might overadapt.</li>
                            </ol>
                        </div>
                    </div>
                    <div className = 'flex flex-col h-[250px] justify-center items-center'>
                        <InputComponent borderColor = {'border-white'} textColor = {'text-white'} id = {'training_tt_split'} 
                        value = {ttsplit} label = 'Validation Split' setFunction = {props.setTTsplit} 
                        textSize = {'text-[30px]'} fieldSize = {'w-[140px]'} allowDecimal = {true}
                        filter = {(input) => {
                            if(input == '')
                            {
                                return 0;
                            }
                            return input - Math.floor(input);
                            }}/>
                        <div className = 'text-[14px] text-white m-[10px] border-2 rounded-2xl p-[5px] h-8/10 overflow-y-auto w-8/10'>
                            <ol className = 'list-disc list-inside'>
                                <li>Validation rate tells tfBlocks the proportion of the input data that should be set aside for <i>validation</i>.</li>
                                <li>A rate of 0 indicates that you don't want to do validation, while a rate of 1 indicates that you only want to do validation.</li>
                                <li>Validation is a process where the model goes through a dry run of all the data in the validation set and grades itself.</li>
                                <li>Importantly, unlike in training, it <i>doesn't</i> adjust to its results on the validation set</li>
                                <li>While it sounds like a waste of data and time, validation is an important part of helping us make sure that the model isn't <i>overfitting</i></li>
                                <li>A good way to see if a model is overfitting, for example, is by making sure the <i>loss</i> and <i>validation loss</i> are similar.</li>
                                <li>If they aren't, it might suggest that the model is no longer learning generalizable traits. When that happens, it's advised to <i>shut off</i> training.</li>
                            </ol>
                        </div>
                    </div>
                    <div className = 'flex flex-col h-[250px] justify-center items-center'>
                        <label className = 'text-[30px] text-white' htmlFor = {`train_optimizer`}>Optimizer</label>
                        <div className = "w-fit border-1 border-white flex justify-center items-center rounded-2xl" >
                            <select id = {`train_optimizer`} value = {optimizer} onChange = {handleOptimizerChange} className = 'p-[10px] text-white text-center'>
                                <option value = "adam">Adam</option>
                                <option value = "sgd">Stochastic Gradient Descent</option>
                                <option value = "rmsprop">RMSprop</option>
                            </select>
                        </div>
                        <div className = 'text-[14px] text-white m-[10px] border-2 rounded-2xl p-[5px] h-8/10 overflow-y-auto w-8/10'>
                            <ol className = 'list-disc list-inside'>
                                <li>The optimizer is the function that tfBlocks uses to determine how exactly to change a model's parameters after each batch.</li>
                                <li><Link href = "https://www.geeksforgeeks.org/deep-learning/adam-optimizer/">Adam</Link>, which combines <i>momentum</i> and <i>RMSprop</i>, is the most commonly used optimizer</li>
                                <li><Link href = "https://www.geeksforgeeks.org/machine-learning/ml-stochastic-gradient-descent-sgd/">Stochastic Gradient Descent</Link>, a variant of gradient descent, is another commonly used optimizer</li>
                            </ol>
                        </div>
                    </div>
                    <div className = 'flex flex-col h-[250px] justify-center items-center'>
                        <label className = 'text-[30px] text-white' htmlFor = {`train_loss`}>Loss Function</label>
                        <div className = "w-fit border-1 border-white flex justify-center items-center rounded-2xl" >
                            <select id = {`train_loss`} value = {loss} onChange = {handleLossChange} className = 'p-[10px] text-white text-center'>
                                <option value = "mse">Mean Squared Error</option>
                                <option value = "crossentropy">Crossentropy</option>
                            </select>
                        </div>
                        <div className = 'text-[14px] text-white m-[10px] border-2 rounded-2xl p-[5px] h-8/10 overflow-y-auto w-8/10'>
                            <ol className = 'list-disc list-inside'>
                                <li>The loss function, which is used to calculate loss, determines <i>what good performance</i> even means for a model.</li>
                                <li>Mean Squared Error is used on <Link href = "https://www.geeksforgeeks.org/machine-learning/regression-in-machine-learning/"> regression/estimation </Link> tasks, where outputs are <i>real</i> values that mean real things.</li>
                                <li>CrossEntropy is used on <Link href = "https://www.geeksforgeeks.org/machine-learning/getting-started-with-classification/"> classification </Link> tasks, where outputs are <i>probability</i> distributions.</li>
                            </ol>
                        </div>
                    </div>
                </div>
                <div className = 'pt-[40px] w-full h-fit flex justify-around items-center pb-[30px]'>
                     <div className = 'w-1/2 flex justify-around items-center'>
                        <button onClick = {props.turnOff}>
                            <div className = 'min-w-fit h-[50px] border-1 rounded-2xl border-black bg-red-400 flex justify-center items-center cursor-pointer'>
                                <div className = 'p-[15px]'>
                                    <p className = 'text-[30px] text-white text-center'>Cancel</p>
                                </div>
                            </div>
                        </button>
                        <button onClick = {async () => {
                            if(isNaN(batchSize) || isNaN(epochs) || isNaN(eta) || isNaN(ttsplit) || optimizer == '' || loss == '')
                            {
                                alert('Please fill in all fields with valid values.');
                                return;
                            }
                            else{
                                const response = await axios.post(`http://localhost:${get_port()}/api/trainModel/`, {
                                    batch_size: batchSize,
                                    epochs: epochs,
                                    eta: eta,
                                    ttsplit: ttsplit,
                                    optimizer: optimizer,
                                    loss: loss
                                })
                                if(response.status == 200)
                                {
                                    alert('Training started successfully!');
                                    props.proceed();
                                }
                                else{
                                    alert('Error starting training: ' + response.data.message);
                                    props.turnOff();
                                }
                            }
                        }}>
                            <div className = 'min-w-fit h-[50px] border-1 rounded-2xl border-black bg-green-400 flex justify-center items-center cursor-pointer'>
                                <div className = 'p-[15px]'>
                                    <p className = 'text-[30px] text-white text-center'>Train!</p>
                                </div>
                            </div>
                        </button>
                    </div>

                </div>
            </div>
            </div>
        </>
    )
}
export default TrainingMenu