import '../../App.css'
import { useState } from 'react'
import Blocks from './Blocks'


const Toolbox = (props : any) => {
    const [menuOn, setMenuOn] = useState('Common')
    const Choice = (props : any) => {
        return <div className = {`w-full flex flex-col justify-center items-center ${menuOn == props.choice ? 'bg-gray-200' : ''}`}>
                    <button className = 'w-1/4 min-w-[30px] cursor-pointer aspect-square mt-[18px] mb-[6px] flex flex-col justify-center items-center' onClick = {() => setMenuOn(props.choice)}>
                        <div className = {`w-full h-full rounded-full ${props.bgColor} border-black border-1`}></div>
                    </button>
                    <p className = "text-[12px] text-center break-all">{props.choice}</p>
                </div>
    }
    
    return (
        <div className = 'flex h-full w-full'>
            <div className = 'w-3/10 h-full flex flex-col items-center border-gray-500 border-l-2 border-t-2 border-b-2'>
                <Choice choice = 'Common' bgColor = 'bg-blue-500'></Choice>
                <Choice choice = 'Normalization' bgColor = 'bg-purple-400'></Choice>
                <Choice choice = 'Operations' bgColor = 'bg-yellow-300'></Choice>
                <Choice choice = 'Reshape' bgColor = 'bg-stone-300'></Choice>
                <Choice choice = 'Recurrent' bgColor = 'bg-lime-400'></Choice>
                <Choice choice = 'Custom' bgColor = 'bg-pink-400'></Choice>
            </div>
            <div className = 'w-7/10 h-full'>
                <Blocks activeID = {props.activeID} menu = {menuOn}/>
            </div>
        </div>
    )
}
export default Toolbox