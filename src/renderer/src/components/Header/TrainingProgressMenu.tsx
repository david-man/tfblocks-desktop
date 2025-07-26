import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { CircularProgressbarWithChildren, buildStyles } from 'react-circular-progressbar';
import "react-circular-progressbar/dist/styles.css";
const ProgressMenu = (props : any) => {
    const totalEpochs = props.epochs
    const usingValidation = props.usingValidation

    const [clicks, setClicks] = useState(0);
    const seconds = useRef(5);
    const [epochsOn, setEpochsOn] = useState(0);
    const [latestValLoss, setLatestValLoss] = useState(0);
    const [latestLoss, setLatestLoss] = useState(0);
    const [trainingComplete, setTrainingComplete] = useState(false);
    useEffect(() => {
        electronPort.getPort().then(async (port) => {
            console.log(port)
            const interval = setInterval(async () => {
                    const resp = await axios.get(`http://localhost:${port}/api/getTrainingLogs/`)
                    try{
                        const data = resp.data;
                        setEpochsOn(data['epochs']);
                        setLatestLoss(data['loss']);
                        if(usingValidation)
                        {
                            setLatestValLoss(data['val_loss']);
                        }
                        if(data['training_complete'])
                        {
                            setTrainingComplete(true);
                            clearInterval(interval);
                        }
                    }
                    catch (error) {
                        setTrainingComplete(true);
                        clearInterval(interval);
                    }
                }, 1000)
            return () => {
                clearInterval(interval)
            }
        }).catch((error) => {
                console.error("Error getting port:", error);
                alert("There was an error connecting to the backend server. Please ensure it is running.");
            });
    }, [])

    useEffect(() => {
        if(clicks == 1)
        {
            const timeout = setInterval(() => {

                if(seconds.current == 1 || trainingComplete)
                {
                    setClicks(0);
                    clearInterval(timeout);
                }
                else{
                    seconds.current -= 1;
                }
            }, 1000);
            return () => {
                seconds.current = 5;
                clearInterval(timeout);
            }
        }
        return () => {}
    }, [clicks])
    return (
        <>
        <div className = 'absolute w-full h-full z-10 flex flex-col justify-center items-center'>
            <div className = ' border-black rounded-2xl w-95/100 h-95/100 bg-gray-500 opacity-70 flex flex-col'>
            </div>
        </div>
        <div className = 'absolute w-full h-full z-11 flex flex-col justify-center items-center'>
            <div className = 'w-95/100 h-95/100 overflow-y-auto justify-center items-center p-[10px] scroll-p-10'>
                <div className = 'min-h-fit m-[10px]'>
                    <p className = 'text-[100px] text-white text-center mb-[10px] text-wrap'>Training in Progress</p>
                </div>
                <p className = 'text-[15px] text-white text-center mb-[40px]'>For your model to properly save, please do not shut down tfBlocks during the training process.</p>
                <div className = 'w-full min-h-fit flex flex-col justify-center items-center'>
                    <CircularProgressbarWithChildren 
                    className = 'w-[200px] h-[200px]'
                    minValue = {0} maxValue = {totalEpochs} 
                        value = {epochsOn}
                        strokeWidth={8}
                        styles = {buildStyles({
                            strokeLinecap: 'round',
                            pathColor: '#05df72',
                            pathTransitionDuration: 0.5,
                            trailColor: '#6a7282'
                        })}>
                            <div className = 'flex flex-col justify-center items-center m-[10px]'>
                                <p className = 'text-[16px] text-white text-wrap text-center'>{`${epochsOn} epochs out of ${totalEpochs} complete`}</p>
                            </div>
                        </CircularProgressbarWithChildren>
                </div>
                
                <p className = 'text-[30px] text-white text-center p-[10px]'>Latest Loss: {latestLoss.toPrecision(6)}</p>
                {usingValidation ? <p className = 'text-[30px] text-white text-center p-[10px]'>Latest Validation Loss: {latestValLoss.toPrecision(6)}</p> : null}
                <div className = 'pt-[40px] w-full h-fit flex justify-around items-center pb-[30px]'>
                     <div className = 'w-1/2 flex justify-around items-center'>
                        <button onClick = {() => {
                            if(clicks == 1 || trainingComplete)
                            {
                                props.turnOff();
                            }
                            else{
                                setClicks(1)
                            }
                        }}>
                            <div className = {`min-w-fit h-[50px] border-1 rounded-2xl border-black ${trainingComplete ? 'bg-green-400' : 
                                    (clicks == 0 ? 'bg-red-400' : 'bg-red-800')} 
                                flex justify-center items-center cursor-pointer`}>
                                <div className = 'p-[15px]'>
                                    <p className = 'text-[30px] text-white text-center'>{
                                        trainingComplete ? 'Continue' :
                                            (clicks == 0 ? "Stop Training" : `Click again to confirm(${seconds.current})`)
                                    }</p>
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
export default ProgressMenu
