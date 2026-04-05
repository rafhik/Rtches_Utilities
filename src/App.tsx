import { useEffect, useState } from 'react'
/* import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png' */
import './App.css'
import * as WorkspaceAPI from "trimble-connect-workspace-api"
import SectionPlanesCreator from './components/SectionPlanesCreator'
import MarkupAnnotations from './components/MarkupAnnotations'
import ElementSearch from './components/ElementSearch'


function App() {
  //const [count, setCount] = useState(0)
  const [tcApi, setTcApi] = useState<WorkspaceAPI.WorkspaceAPI | null>(null);

  useEffect(() => {
    async function connectWithTcAPI() {
        const api = await WorkspaceAPI.connect(window.parent, (_event:any, _data: any) =>{
        
    });

    setTcApi(api);

  }
  
  connectWithTcAPI();
  },[]);

  if (!tcApi) {
    return <div>Cargando...</div>;
  }


  
  return (
    <>
      <section id="center">
{/*         <div className="hero">
          <img src={heroImg} className="base" width="170" height="179" alt="" />
          <img src={reactLogo} className="framework" alt="React logo" />
          <img src={viteLogo} className="vite" alt="Vite logo" />
        </div> */}
        <div>
          <h1>RTCHES Utilities</h1>
          <p>
            Utilidades para Trimble Connect
          </p>
        </div>
        <SectionPlanesCreator api={tcApi as WorkspaceAPI.WorkspaceAPI}></SectionPlanesCreator>
        <MarkupAnnotations api={tcApi as WorkspaceAPI.WorkspaceAPI}></MarkupAnnotations>
        <ElementSearch api={tcApi as WorkspaceAPI.WorkspaceAPI}></ElementSearch>
      </section>

      <section id="spacer"></section>
    </>
  )
}

export default App
