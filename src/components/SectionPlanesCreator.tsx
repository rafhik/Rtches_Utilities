//import React from 'react'

import { type Box3, type SectionPlane, type Vector3, type WorkspaceAPI } from "trimble-connect-workspace-api";
//import * as WorkspaceAPI from "trimble-connect-workspace-api"



export default function SectionPlanesCreator({api} : {api: WorkspaceAPI}) {


    function addBBoxes(box1: Box3, box2: Box3) : Box3{
        const result: Box3 = {isBox3: true, min: box1.min, max: box1.max};


        if (box2.min.x < result.min.x) result.min.x = box2.min.x;
        if (box2.min.y < result.min.y) result.min.y = box2.min.y;
        if (box2.min.z < result.min.z) result.min.z = box2.min.z;

        if (box2.max.x > result.max.x) result.max.x = box2.max.x;
        if (box2.max.y > result.max.y) result.max.y = box2.max.y;
        if (box2.max.z > result.max.z) result.max.z = box2.max.z;



        return box1;
    }
    
    function createSectionPlane(point: Vector3, direction: Vector3): SectionPlane{
        const unitFactor = 1000;
        const offset = 400;
    
        const x = point.x * unitFactor + direction.x * offset;
        const y = point.y * unitFactor + direction.y * offset;
        const z = point.z * unitFactor + direction.z * offset;
    
        const plane: SectionPlane={
            positionX: x,
            positionY: y,
            positionZ: z,
            directionX: direction.x,
            directionY: direction.y,
            directionZ: direction.z,
            controlsVisible: false
        };
    
        return plane;
    }

    async function triggerGetSelection() {
    //const api = await connect(window.parent, (_event:any, _data: any) =>{
    //
    //});
    
    await api.viewer.removeSectionPlanes();
    const selection = await api.viewer.getSelection()
    if (selection.length==0) return;
    const fisrtModelObjects = selection[0];
    
    if (fisrtModelObjects.objectRuntimeIds=== undefined) return;


    const bBoxes = await api.viewer.getObjectBoundingBoxes(fisrtModelObjects.modelId,fisrtModelObjects.objectRuntimeIds);
    const firstBBox = bBoxes.map(b => b.boundingBox).reduce((a,b) => addBBoxes(a,b));

    const secPlane: SectionPlane[] = [
        createSectionPlane(firstBBox.min, {x:0, y:0, z:-1}),
        createSectionPlane(firstBBox.max, {x:0, y:0, z:1}),
        createSectionPlane(firstBBox.min, {x:-1, y:0, z:0}),
        createSectionPlane(firstBBox.max, {x:1, y:0, z:0}),
        createSectionPlane(firstBBox.min, {x:0, y:-1, z:0}),
        createSectionPlane(firstBBox.max, {x:0, y:1, z:0})];
    
    await api.viewer.addSectionPlane(secPlane);

  }

return (
    <>    
    <button className="counter" onClick={triggerGetSelection}>
            Aislar Seleccion
        </button>
    </>
)


}