import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
//import * as WorkspaceAPI from "trimble-connect-workspace-api"
import SectionPlanesCreator from './components/SectionPlanesCreator'


function App() {
  const [count, setCount] = useState(0)

  function increasecounter():void {
    //const test = count;
    setCount((count) => count + 1);
  } 
  
  return (
    <>
      <section id="center">
        <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div>
        <div>
          <h1>RTCHES Utilities</h1>
          <p>
            Utilidades para Trimble Connect
          </p>
        </div>
        <button
          className="counter"
          onClick={increasecounter}
        >
          Count is {count}
        </button>
        <SectionPlanesCreator></SectionPlanesCreator>
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
