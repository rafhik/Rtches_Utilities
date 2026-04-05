import { useRef, useState } from "react";
import { type Box3, type MarkupPick, type TextMarkup, type Vector3, type WorkspaceAPI } from "trimble-connect-workspace-api";

export default function MarkupAnnotations({api} : {api: WorkspaceAPI}) {

const previousIds = useRef<number[]>([])
const [propertyName, setPropertyName] = useState<string>('');

    function getMidPoint(bBox: Box3): Vector3 {
        const x = (bBox.min.x + bBox.max.x) / 2.0;
        const y = (bBox.min.y + bBox.max.y) / 2.0;
        const z = (bBox.min.z + bBox.max.z) / 2.0;

        return { x: x, y: y, z: z} ;
    }   

    async function getPropertyValue(modelId: string, objectId: number, propertyName: string) : Promise<string> {

        const splitted = propertyName.split('.');
        const set = splitted[0];
        const propertyType = splitted[1];
        
        const properties = await api.viewer.getObjectProperties(modelId, [objectId]);
        console.log (properties);
        const props = properties[0].properties;
        if (props===undefined) return '';
        
        const propertySet = props.find(p=> (p as any).name === set);
        if (propertySet===undefined || propertySet.properties === undefined) return '';

        const property = propertySet.properties.find(p => p.name === propertyType);
        if (property === undefined) return '';

        
        return property.value.toString();
        
    }

    async function triggerTextAnnotation() {

        await api.markup.removeMarkups(previousIds.current);

        const selection = await api.viewer.getSelection();
        if (selection.length == 0) return;

        var firstSelection = selection[0];
        if (firstSelection.objectRuntimeIds === undefined) return;

        const markups: TextMarkup[] = [];

        const bBoxes = await api.viewer.getObjectBoundingBoxes(firstSelection.modelId, firstSelection.objectRuntimeIds);
        
        for (let i = 0; i < bBoxes.length; i++) {
            const bBox = bBoxes[i];

            const midPoint = getMidPoint(bBox.boundingBox);

            const point: MarkupPick = {
                positionX: midPoint.x * 1000, 
                positionY: midPoint.y * 1000, 
                positionZ: midPoint.z *1000
            };

            const value = await getPropertyValue(firstSelection.modelId, bBox.id, propertyName);

            const markup: TextMarkup = {
                text: value,
                start: point,
                end: point,


            };

            markups.push(markup);

            
            
            
        }
        const markupsIds = (await api.markup.addTextMarkup(markups)).map(t => t.id as number);
        previousIds.current = markupsIds;


        //const markups = await api.markup.getTextMarkups();


        console.log(markups);

    }



    return (
    <>
    <input type="text" value={propertyName} onChange={e => setPropertyName(e.target.value)}></input>    
    <button className="counter" onClick={triggerTextAnnotation}>
            Anotar Seleccion
        </button>
    </>
)
}