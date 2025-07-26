import '../../App.css'
import dependencyController from '../../controllers/dependencyController'
import nodeController from '../../controllers/nodeController'
import propertyController from '../../controllers/propertyController'
import axios from 'axios'
import type { Node } from '@xyflow/react'
import { useState } from 'react'
import CompilationMenu from './CompilationMenu'
import TrainingMenu from './TrainingMenu'
import ProgressMenu from './TrainingProgressMenu'
import portController from '../../controllers/portController'
const Header = () => {
    const [epochs, setEpochs] = useState<number>(32);
    const [ttsplit, setTTsplit] = useState<number>(0.2);

    const {nodes} = nodeController()
    const {get_map, get_properties} = propertyController()
    const {get_dep_map, get_child_map, get_network_heads, get_dependencies, get_children} = dependencyController()
    const [headerState, setHeaderState] = useState('header')
    const {get_port} = portController()

    const [recurrentHeadIn, setRecurrentHeadIn] = useState(false)

    const findNetwork = (id : String) => {
        let to_ret = "hanging"
        get_network_heads().map((network_head : String) => {
        let nodes_to_search = [network_head]
        let nodes_searched : Array<String> = []
        while(!(nodes_to_search.length === 0) && to_ret  === 'hanging'){
            let next_node = nodes_to_search.pop()!
            if(next_node === id){
            to_ret = network_head as string
            }
            let dep = get_dependencies(next_node)
            let children = get_children(next_node)
            let surroundings = dep.concat(children).filter((next : String) => !nodes_searched.includes(next))

            if(surroundings.includes(id)){
            to_ret = network_head as string
            }
            else{
            nodes_to_search = nodes_to_search.concat(surroundings)
            nodes_searched.push(next_node)
            }
        }
        })
        if(to_ret == 'out'){
            to_ret = 'in'//the network for the output layer should ALWAYS be the same as the network for the input layer.
        }
        return to_ret
    }

    const upload = async () => {
        const filtered_network_heads = get_network_heads().filter((id : string) => (id != 'out'))
        try{
            const resp = await axios.post(`http://localhost:${get_port()}/api/sendModel/`, {
                active_nodes : [...nodes.map((node : Node) => {
                    return {id: node.id, type: node.type}
                }).filter((node) => findNetwork(node.id) != 'hanging')],//active nodes defined as nodes that aren't floating around
                properties_map: [...get_map()],
                dependency_map : [...get_dep_map()],
                child_map : [...get_child_map()],
                network_heads : filtered_network_heads
            })
            if(resp.status != 200){
                alert("There was an error in the backend somewhere! Sorry :(")
            }
            
        }
        catch (err){
            alert("There was an error uploading your model! Perhaps the backend server is down :(")
        }
    }

    const handleCompileClick = async () => {
        let send = true;
        setRecurrentHeadIn(false)
        nodes.map((node : Node) => {
            const id = node.id
            if(node.type == 'recurrent_head'){
                const external_id = 'rec_hidden_' + id.toString()
                if(!get_properties(id) || !get_properties(id)?.valid){
                    if(findNetwork(external_id) != 'hanging'){
                        send = false
                    }
                }
                setRecurrentHeadIn(true)
            }
            else {
                if((!get_properties(id) || !(get_properties(id)?.valid)) && findNetwork(id) != 'hanging'){
                    send = false;
                }
            }
        })
        
        if(!send){
            alert("This graph isn't ready to be parsed yet! Make sure you have a valid configuration!")
        }
        else{
            setHeaderState('compilation')
        }
    }

    const handleSaveClick = async () => {
        const dialogConfig = {
                title: 'Save Model To',
                buttonLabel: 'Select',
                properties: ['openDirectory']
            };
        electronDialog.openDialog('showOpenDialog', dialogConfig).then(async result => 
        {
            if (!result.canceled && result.filePaths.length > 0) {
                const folder_path = result.filePaths[0];
                try{
                    const resp = await axios.post(`http://localhost:${get_port()}/api/saveLatestModel/`, {
                        folder_path: folder_path
                    })
                    if(resp.data.message.includes('No model to save')){
                        alert("You don't have any models to save! Please compile or train a model first.")
                    }
                    else{
                        if(recurrentHeadIn){
                            alert("Recurrent heads are not supported in saved models! Do not try to load this model. It will not work.")
                        }
                        else{
                            alert(`Latest model successfully saved to ${folder_path + '/tfblocks_model.keras'}!`)
                        }
                        
                    }
                }
                catch (err){
                    alert("There was an error saving your model! Perhaps the backend server is down :(")
                }
            } else {
            }
        }
        );
    }

    const overlay = () => {
        if(headerState === 'compilation'){
            return <CompilationMenu turnOff = {() => setHeaderState('header')} 
            proceed = {() => setHeaderState('trainOptions')} upload = {upload}/>
        }
        else if(headerState === 'trainOptions'){
            return <TrainingMenu turnOff = {() => setHeaderState('header')}
            proceed = {() => setHeaderState('training')}
            epochs = {epochs} setEpochs = {setEpochs}
            ttsplit = {ttsplit} setTTsplit = {setTTsplit}/>
        }
        else if(headerState == 'training'){
            return <ProgressMenu turnOff = {async () => {
                const response = await axios.post(`http://localhost:${get_port()}/api/forceTrainingEnd/`)
                try{
                    if(response.data['model saved']){
                        alert('Training ended successfully! Click the save icon to save it to a file on your computer.')
                    }
                    else{
                        alert('Training ended, but no model was saved, likely due to an error.')
                    }
                    setHeaderState('header')
                }
                catch (error) {
                    alert('There was an error ending training: ' + error.message)
                }
                
            }
            }
            epochs = {epochs} usingValidation = {ttsplit != 0}/>
        }
        else {
            return null;
        }
    }
    return (
        <>
            {overlay()}
            <div className = "border-2 border-gray-500 w-full h-full relative flex justify-end items-center">
                <div className = 'h-full w-1/12 flex flex-col items-center justify-center absolute left-8'>
                    <img src = {'logo.png'} width = '60px' height = '60px'></img>
                </div>
                <div className = "mr-[30px] h-5/6 min-h-fit rounded-full border-2 border-gray-500 bg-orange-200 flex justify-center items-center aspect-square">
                    <button onClick = {handleSaveClick} className = 'text-[10px] p-[14px] flex flex-col justify-center items-center cursor-pointer'>
                        <img src = 'save_23.png' height = {25} width = {25}></img>
                        <p>Save!</p>
                    </button>
                </div>
                <div className = "mr-[30px] h-5/6 min-h-fit rounded-full border-2 border-gray-500 bg-green-300 flex justify-center items-center aspect-square">
                    <button onClick = {handleCompileClick} className = 'text-[10px] p-[6px] flex flex-col justify-center items-center cursor-pointer'>
                        <img src = 'upload.png' height = {25} width = {25}></img>
                        <p>Compile!</p>
                    </button>
                </div>
            </div>
        </>
    )
}
export default Header