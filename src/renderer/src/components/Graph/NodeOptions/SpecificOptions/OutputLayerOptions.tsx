import portController from '@renderer/controllers/portController';
import axios from 'axios';
const OutputOptions = (props : any) => 
{
    const id = props.id
    const {get_port} = portController()
    const handleInput = async (event : any) => {
        const file : File = event.target.files[0]
        const inputElem = document.getElementById(`file_input_${id}`) as HTMLInputElement | null;
        if (inputElem) {
            inputElem.value = "";
        }
        const filePath = window.electron.webUtils.getPathForFile(file)
        
        if(file)
        {
            try{
            const resp = await axios.post(`http://localhost:${get_port()}/api/getMatrixShape/`, {'file_path': filePath, 'type': 'output'})
            if(resp.status == 200){
                props.setDataShape(resp.data.data_shape)
                props.setFilePath(window.electron.webUtils.getPathForFile(file))
            }
            }
            catch{
                alert("Matrix upload failed!")
            }
            
        }
    }
    return (
    <div>
        <hr className = 'w-full mt-1 border-black'></hr>
        <div className = 'w-full mt-2 p-2 h-[20px] border-1 border-black flex justify-center items-center rounded-2xl'>
            <label htmlFor = {`file_input_${id}`} className = 'text-[10px] cursor-pointer'>Upload Output Here!</label>
            <input id = {`file_input_${id}`} type = "file" accept = '.npy' hidden onChange={handleInput}></input>
        </div>
    </div>)
}
export default OutputOptions