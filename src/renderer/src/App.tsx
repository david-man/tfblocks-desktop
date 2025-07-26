import { type Graph } from './controllers/nodeController'
import { useShallow } from 'zustand/shallow'
import { useEffect, useRef, useState, type MouseEvent} from 'react'
import { ReactFlowProvider, useReactFlow} from '@xyflow/react'
import { DndContext, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core'
import {restrictToWindowEdges} from '@dnd-kit/modifiers'
import './App.css'
import DndOverlay from './components/DragNDrop/DndOverlay'
import dndNodeAddition from './components/DragNDrop/DndHandler'
import Toolbox from './components/Toolbox/Toolbox'
import Header from './components/Header/Header'
import Canvas from './components/Graph/Canvas'
import nodeController from "./controllers/nodeController";
import HelpMenu from './components/HelpMenu/HelpMenu'
import helpMenuController from './controllers/helpMenuController'
import TutorialMenu from './components/TutorialScreen/Tutorial'
import portController from './controllers/portController'
import Link from './link'
export type MousePosn = {
  x : number,
  y : number
}
function PreApp() {
  const {nodes, setNodes, id, setId} = nodeController(useShallow((state : Graph) => ({id: state.id, nodes: state.nodes, setNodes : state.setNodes, setId: state.setId})));
  const [mousePosn, setMousePosn] = useState<MousePosn>({x: 0, y: 0})
  const [dragging, setDragging] = useState<boolean>(false);
  const {screenToFlowPosition} = useReactFlow();
  const [activeID, setActiveID] = useState<string | null>(null);
  const {isHelpMenuOn} = helpMenuController()
  const [showTutorial, setShowTutorial] = useState(true)


  const handleMouseMove = (event : MouseEvent<HTMLDivElement>) => {
    setMousePosn({x: event.clientX, y: event.clientY})
  }

  const handleDragStart = (event : DragStartEvent) => {
    setDragging(true)
    setActiveID(event.active.id.toString())
  }
  const handleDragEnd = (event : DragEndEvent) => {
    setDragging(false)
    if(event.over){
      setId(id + 1)
      dndNodeAddition(event, mousePosn, screenToFlowPosition, nodes, setNodes, id)
    }
    setActiveID(null);
  }

  return (
    <div onMouseMove = {handleMouseMove} className = "w-full h-full font-[DynaPuff] font-weight-[400] relative overflow-x-clip overflow-y-clip">
        <DndContext onDragEnd = {handleDragEnd} onDragStart = {handleDragStart} modifiers = {[restrictToWindowEdges]}>
          {showTutorial ? 
          <div className = 'absolute top-0 left-0 w-full h-full z-1'>
            <TutorialMenu turnOff = {() => setShowTutorial(false)}/>
          </div> : 
          null}
          <div className = "flex flex-col w-full h-full bg-blue-200">
            <div className = "h-1/10 m-1 bg-white">
              <Header/>
            </div>
            <div className = "h-9/10 w-full flex mb-2 relative overflow-x-clip">
              <div className = "w-25/100 h-full mt-1 ml-1 mb-1 bg-white">
                <Toolbox activeID = {activeID}/>
              </div>
              <div className = "flex-grow h-full mt-1 mr-1 mb-1 bg-white">
                {dragging ? <DndOverlay /> : null}
                <Canvas />
              </div>
              <div className = {`transition-all duration-300 h-full absolute top-0 right-0 mt-1 mr-1 mb-1 ${isHelpMenuOn() ? 'opacity-100 w-3/10' : 'opacity-0 w-0'}`}>
                <HelpMenu />
              </div>
            </div>
          </div>
        </DndContext>
    </div>
  )
}

function LoadingScreen() {
  const [refresh, setRefresh] = useState(0)
  const dots = useRef<string>('...')
  useEffect(() => {
    const interval = setInterval(() => {
      if(dots.current === '...') {
        dots.current = '.'
      } else {
        dots.current += '.'
      }
      setRefresh(prev => prev + 1)
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div className = "w-full h-full flex flex-col justify-center items-center">
      <img src = "loading.gif"></img>
      <div className = "text-2xl font-bold">Waiting for backend to start{dots.current}</div>
      <div className = "text-[10px] font-bold">Loading screen made by <Link href = "https://dribbble.com/shots/3306683-Tetris-shaped-loader">Vitaly Silkin</Link></div>
    </div>
  )
}
function App() {
  const [ready, setReady] = useState(false);
  const {set_port} = portController()
  useEffect(() => {
    const checkReady = setInterval(() =>{
      electronPort.getPort().then(async (port : string) => {
        if(port != ''){
          setReady(true);
          clearInterval(checkReady);
          set_port(port)
        }
      }).catch((error) => {
        console.error("Error getting port from Electron:", error);
      })
    }, 1000)
  }, []);
  return (
  ready ? <ReactFlowProvider>
    <PreApp/>
  </ReactFlowProvider> : <LoadingScreen />)
}
export default App
