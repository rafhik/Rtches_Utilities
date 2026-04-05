import { useEffect, useRef, useState } from "react";
import type { ObjectProperties, ObjectSelector, WorkspaceAPI } from "trimble-connect-workspace-api";

export default function ElementSearch({ api }: { api: WorkspaceAPI }) {

    const [searchValue, setSearchValue] = useState<string>('');
    //const [filteredObjects, setFilteredObjects] = useState<ObjectProperties[]>([]);
    const [filteredObjects, setFilteredObjects] = useState<{ modelId: string, object: ObjectProperties }[]>([]);

    // 👉 Ahora se almacenan todos los modelos
    const allModels = useRef<{ modelId: string, objects: ObjectProperties[] }[]>([]);

    // =============================
    // CARGA INICIAL DE OBJETOS
    // =============================
    useEffect(() => {
        if (!api?.viewer) return;

        async function getObjectProperties() {

            const objectSelector: ObjectSelector = {
                output: { loadProperties: true }
            };

            const response = await api.viewer.getObjects(objectSelector);

            if (response.length === 0) return;

            // 👉 Guardar TODOS los modelos
            allModels.current = response;
        }

        getObjectProperties();

    }, [api]);

    // =============================
    // FILTRADO POR TEXTO
    // =============================
    useEffect(() => {
        if (!api?.viewer) return;

        if (searchValue.length === 0) {
            setFilteredObjects([]);
            api.viewer.setSelection({ modelObjectIds: [] }, "set");
            return;
        }

        if (allModels.current.length === 0) {
            setFilteredObjects([]);
            return;
        }

        const loweredSearch = searchValue.toLowerCase();

        const resultPerModel: { modelId: string, objectRuntimeIds: number[] }[] = [];
        const filtered: { modelId: string, object: ObjectProperties }[] = [];

        for (const model of allModels.current) {

            const matchingIds: number[] = [];

            for (const modelObject of model.objects) {

                //if (!modelObject.properties) continue;

                const textMatchesBasic =
                    modelObject.product?.name?.toLowerCase().includes(loweredSearch) ||
                    modelObject.product?.description?.toLowerCase().includes(loweredSearch)||
                    modelObject.class?.toLowerCase().includes(loweredSearch);

                // Evaluación de PropertySets (como ya tienes)
                const textMatchesProperties = modelObject.properties?.some(pSet => {
                    if (!pSet.properties) return false;

                    return pSet.properties.some(p =>
                        p.value?.toString().toLowerCase().includes(loweredSearch)
                    );
                });
                
                // Resultado final combinado
                const anyMeets = textMatchesBasic || textMatchesProperties;
                // const anyMeets = modelObject.properties.some(pSet => {
                //     if (!pSet.properties) return false;

                //     return pSet.properties.some(p =>
                //         p.value?.toString().toLowerCase().includes(loweredSearch)
                //     );
                // });

                if (anyMeets) {
                    matchingIds.push(modelObject.id);
                    filtered.push({
                        modelId: model.modelId,
                        object: modelObject
                    });
                }
            }

            if (matchingIds.length > 0) {
                resultPerModel.push({
                    modelId: model.modelId,
                    objectRuntimeIds: matchingIds
                });
            }
        }

        // 👉 Aplicar selección en el visor
        if (resultPerModel.length > 0) {
            const objectSelector: ObjectSelector = {
                modelObjectIds: resultPerModel
            };

            api.viewer.setSelection(objectSelector, "set");
        } else {
            api.viewer.setSelection({ modelObjectIds: [] }, "set");
        }

        setFilteredObjects(filtered);

    }, [searchValue, api]);

    // =============================
    // INTERFAZ
    // =============================
    return (
        <>
            <p>Buscar en el modelo:</p>

            <input
                type="text"
                value={searchValue}
                onChange={e => setSearchValue(e.target.value)}
                placeholder="Introducir texto..."
            />

            <ul>
                {
                    filteredObjects.map(item =>
                        <li key={`${item.modelId}-${item.object.id}`}>
                            {item.object.product?.name || `ID: ${item.object.id}`}
                        </li>
                    )
                }
            </ul>
        </>
    );
}