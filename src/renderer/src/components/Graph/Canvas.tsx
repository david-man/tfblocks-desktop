import { useEffect, useRef } from "react";
import { useShallow } from "zustand/react/shallow";
import { type Graph } from "../../controllers/nodeController";
import {
  Background,
  Controls,
  MiniMap,
  ReactFlow,
  useReactFlow,
  type Node,
  type Connection,
} from "@xyflow/react";
import { nodeTypes } from "./nodetypes";
import { edgeTypes } from "./edgetypes";
import "@xyflow/react/dist/style.css";
import AnnotatedConnectionLine from "./ConnectionLines/AnnotatedConnectionLine";
import '../../App.css'
import nodeController from "../../controllers/nodeController";
import dependencyController from "../../controllers/dependencyController";
import helpMenuController from "../../controllers/helpMenuController";

const selector = (state: Graph) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodes : state.getNodes,
  setNodes : state.setNodes,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
});
const Canvas = () => {
  const ref = useRef(null)
  const { nodes, edges, setNodes, onNodesChange, onEdgesChange, onConnect} = nodeController(useShallow(selector));
  const {get_network_heads, get_dep_map, get_dependencies, get_children} = dependencyController()
  const { updateNodeData } = useReactFlow()
  const {turnHelpMenuOff} = helpMenuController()
  
  const has_dependency = (child_id : String, comparison: String) => {
    if(child_id === comparison){
      return true;
    }
    else if(!get_dep_map().has(child_id) || child_id === 'in'){
      return false
    }
    else{
      let in_branch = false;
      get_dep_map().get(child_id)?.map((parent : String) => {
        in_branch = in_branch || has_dependency(parent, comparison)
      })
      return in_branch
    }
  }
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
      to_ret = 'in'
    }
    return to_ret
  }
  const handleConnect = (new_connection : Connection) => {
    const connection_source = new_connection?.sourceHandle?.split("|")[0]
    const target_source = new_connection?.targetHandle?.split("|")[0]
    const connection_net = findNetwork(connection_source!)
    const target_net = findNetwork(target_source!)
    if(connection_source === 'in' && target_source === 'out'){
        alert("You can't directly connect the input layer to the output layer! Try putting a layer in between")
        return
    }

    
    if(connection_source!.includes('in') || connection_source!.includes('rec_hidden')){
      if(target_net === connection_source || target_net === 'hanging'){
        if(target_source!.includes('rec_external_') && connection_source != 'in'){
          alert("Because of the complex network gradients and building process involved with nested custom RNNs, while we can still compile a model, we HIGHLY recommend you switch to something else.")
        }
        onConnect(new_connection)
      }
      else{
        alert("This connection is illegal(network difference)")
      }
    }
    else if(target_source!.includes('rec_hidden')){
      if(connection_net === target_source){
        onConnect(new_connection)
      }
      else if(connection_net === 'hanging'){
        const external_equivalent = target_source!.replace('rec_hidden', 'rec_external')
        if(has_dependency(connection_source!, external_equivalent)){
          alert("This connection cannot be made due to external dependencies")
        }
        else{
          onConnect(new_connection)
        }
      }
      else{
        alert("This connection is illegal(network difference)")
      }
    }
    else{
      if(target_source!.includes('rec_external') && connection_net.includes('rec_hidden_')){
        alert("Because of the complex network gradients and building process involved with nested custom RNNs, while we can still compile a model, we HIGHLY recommend you switch to something else.")
      }
      
      if(target_net === 'hanging' && connection_net === 'hanging'){
        if(has_dependency(connection_source!, target_source!)){
          alert("This connection is illegal(illegal looping)")
        }
        else{
          onConnect(new_connection)
        }
      }
      else if(target_net === 'hanging' || connection_net === 'hanging'){
        onConnect(new_connection)
      }
      else if(target_net != connection_net){
        alert("This connection is illegal(network difference)")
      }
      else{
        if(has_dependency(connection_source!, target_source!)){
          alert("This connection is illegal(illegal looping)")
        }
        else{
          onConnect(new_connection)
        }
      }
    }
  }
  useEffect(() => {
    const input : Node = { id: 'in', type: 'input_layer', position: { x: 100, y: 150 }, data: { label: 'Input Layer', shape: undefined}, deletable : false}
    const out : Node= { id: 'out', type: 'output_layer', position: { x: 400, y: 150 }, data: { label: 'Output Layer', shape: undefined }, deletable : false }
    setNodes([input, out])
  }, [])
  return (
    <div style={{ width: "100%", height: "100%"}}  className = 'border-gray-500 border-2'>
      <ReactFlow
        ref = {ref}
        nodes={nodes}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        edges={edges}
        edgeTypes={edgeTypes}
        onEdgesChange={onEdgesChange}
        onConnect={handleConnect}
        connectionLineComponent={AnnotatedConnectionLine}
        onNodeContextMenu={(event, node) => {
          event.preventDefault()
          updateNodeData(node.id, {showMenu:true})}}
        onPaneClick={(event) => {
          event.preventDefault()
          setNodes(nodes.map((node : Node) => ({ ...node, data: {...node.data, showMenu: false}, selected: false })));//shuts off all node options menus
          turnHelpMenuOff()
        }}

        fitView = {false}
        defaultViewport={{x:0, y:0, zoom: 3}}
      >
        <Background/>
        <MiniMap />
        <Controls />
      </ReactFlow>
    </div>
  );
}
export default Canvas;
