import { writable, type Writable } from 'svelte/store';
import widgets from '@src/components/widgets';
import collectionsStatic, {allCollections} from '@src/collections';
export let collectionValue: any = writable({}); // collective data of collection
export let mode: Writable<'view' | 'edit' | 'create' | 'delete'> = writable('view');
export let entryData: Writable<any> = writable({});
export let deleteEntry: Writable<() => any> = writable(() => {});

export function createCollectionStore(defaultEndpoint = "/getCollectionsFile") {
    const collections = writable([] as {collectionImport: any, name: string}[]);
    let collectionsStore = {
        subscribe: collections.subscribe,
        async updateCollection(collectionsNew?: any, endpoint = defaultEndpoint) {

            let collectionsFiles = []
            let res: Response
            if( collectionsNew != null) {
                res = collectionsNew
            }
            else {
                if(typeof document === "undefined") {
                    let { getCollectionsFile } = await import("@src/routes/getCollectionsFile")
                    res = new Response(JSON.stringify(await getCollectionsFile()))
                } else {
                    res = await fetch(endpoint)
                }
            }
            collectionsFiles = await res.json()
            for(let {name, path} of collectionsFiles) {
                try {
                    globalThis.widgets = globalThis.widgets ?? widgets
                    if(globalThis.importedCollections == null) globalThis.importedCollections = new Set()
                    console.log(globalThis.importedCollections)
                    if(globalThis.importedCollections.has(path)) {
                        continue
                    }
                    globalThis.importedCollections.add(path)
                    let {default: collectionImport } = await import(/* @vite-ignore */ path)
                    console.log("widgets", globalThis.widgets)
                    if(collectionImport == null) continue
                    let importIndex = collectionsStatic.find(c => c.name === collectionImport.name)
                    if(importIndex > -1) {
                        collectionsStatic[importIndex] = collectionImport
                    } else {
                        collectionsStatic.push(collectionImport)
                    }
                    allCollections[name] = collectionImport
                    collections.update(collections => [...collections, {collectionImport, name}])
                    globalThis.importedCollections.delete(path)
                } catch(err) {
                    console.log(err)
                }
            }
        }
    }
    console.log("collections", collectionsStore)
    return collectionsStore
}

export const collections = createCollectionStore();
console.log(collections)
