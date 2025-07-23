import { Position, useNodeConnections, type NodeConnection, type NodeProps} from '@xyflow/react';
import { Handle} from '@xyflow/react';
import { useEffect, useState} from 'react';
import NodeComponent from '../NodeComponent';
import handleController from '../../../../controllers/handleController';
import propertyController from "../../../../controllers/propertyController"
import CustomMatrixOptions from '../../NodeOptions/SpecificOptions/CustomMatrixOptions';


const CustomMatrixNode = (props : NodeProps) =>{
    const id = props.id.toString()
    const outgoing_handle_id = `${id}|output_handle_1`
    const {set_handle_shape} = handleController()
    const {set_properties} = propertyController()
    const [data_shape, set_data_shape] = useState<Array<number> | undefined>(undefined)
    const [valid, setValid] = useState(false)
    const [filePath, setFilePath] = useState(undefined)
    const outgoingConnection = useNodeConnections({
        handleType: "source",
        handleId: outgoing_handle_id
    })
    const ChildHandles = outgoingConnection.filter((connection : NodeConnection) => connection.targetHandle ? true : false)
                                            .map((connection : NodeConnection) => connection.targetHandle)

    useEffect(() => {
        set_data_shape(undefined)
        setValid(false)
        set_properties(id, {"valid": false})
    }, [])

    useEffect(() => {
        if(data_shape && filePath){
            setValid(true)
            set_properties(id, {"valid": true, "output_handle_id": outgoing_handle_id, "file_path": filePath})
        }
        set_handle_shape(outgoing_handle_id, data_shape)
    }, [data_shape, filePath])

    const optionsMenu = <CustomMatrixOptions id = {id} setFilePath = {setFilePath} setDataShape = {set_data_shape}/>;
    
    return (
        <div className = 'w-[150px]'>
            <Handle type="source" position={Position.Right} id={outgoing_handle_id}/>
            <NodeComponent optionsMenu = {optionsMenu} valid_node = {valid} mainText = {"Custom Matrix"} 
            subtext = {`[${data_shape ? data_shape.toString() : ''}]`}
            parent_handles = {[]}
            child_handles = {ChildHandles}
            bg_color = 'bg-pink-400'
            {...props}/>
        </div>
    );
}
export default CustomMatrixNode