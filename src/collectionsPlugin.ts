import path from "path"
import type vite from "vite"
export function loadCollections({
    collectionsPath = "src/collections",
    builtCollectionsPath = "src/builtCollections"
}: {
    collectionsPath?: string,
    builtCollectionsPath?: string
} = {}) {
    let firstSSR = true;

    return {
        name: 'load-collections',
        config() {
            return {
                define: {
                    "import.meta.env.appRoot": "''",
                    "import.meta.env.collections": `"${path.resolve(process.cwd(), collectionsPath)}"`,
                    "import.meta.env.collectionsBuilt": `"${path.resolve(process.cwd(), builtCollectionsPath)}"`
                }
            }
        },
        async transform(code: string, id: string, options?: {ssr?: boolean}) {
            if(options?.ssr && firstSSR) {
                let WorkerVar = "collectionsBuilderWorker"
                let buildVar = "build"
                let watchVar = "watch"
                let readdirVar = "readdir"
                let statVar = "stat"
                let mkdirVar = "mkdir"
                let rmVar = "rm"
                let EventEmitterVar = "EventEmitter"
                let pathVar = "path"
                let envPublicVar = "envPublic"
                let svelteVar = "svelte"
                let environmentVar = "environment"
                let dirWatcherVar = "dirWatcher"
                let statReactVar = "statReact"
                let collectionsFolderVar = "collectionsFolder"
                let builtCollectionsFolderVar = "builtCollectionsFolder"

                while(code.includes(WorkerVar)) {
                    WorkerVar += "_"
                }
                while(code.includes(buildVar)) {
                    buildVar += "_"
                }
                while(code.includes(watchVar)) {
                    watchVar += "_"
                }
                while(code.includes(readdirVar)) {
                    readdirVar += "_"
                }
                while(code.includes(statVar)) {
                    statVar += "_"
                }
                while(code.includes(mkdirVar)) {
                    mkdirVar += "_"
                }
                while(code.includes(rmVar)) {
                    rmVar += "_"
                }
                while(code.includes(EventEmitterVar)) {
                    EventEmitterVar += "_"
                }
                while(code.includes(pathVar)) {
                    pathVar += "_"
                }
                while(code.includes(envPublicVar)) {
                    envPublicVar += "_"
                }
                while(code.includes(svelteVar)) {
                    svelteVar += "_"
                }
                while(code.includes(environmentVar)) {
                    environmentVar += "_"
                }
                while(code.includes(dirWatcherVar)) {
                    dirWatcherVar += "_"
                }
                while(code.includes(statReactVar)) {
                    statReactVar += "_"
                }
                while(code.includes(collectionsFolderVar)) {
                    collectionsFolderVar += "_"
                }
                while(code.includes(builtCollectionsFolderVar)) {
                    builtCollectionsFolderVar += "_"
                }

                firstSSR = false
                return `import ${WorkerVar} from "${
new Array(id.replace(process.cwd(), "").split("/").length - 2).fill("..").join("/") 
                    + "/src/collectionsBuilder"
                }?nodeWorker"
import { build as ${buildVar}} from "vite"
import { 
    watch as ${watchVar},
    readdir as ${readdirVar},
    stat as ${statVar},
    mkdir as ${mkdirVar},
    rm as ${rmVar}
} from "fs/promises"
import ${EventEmitterVar} from "events"
import ${pathVar} from "path"
import * as ${envPublicVar} from "$env/static/public"
import { svelte as ${svelteVar} } from "@sveltejs/vite-plugin-svelte"
import * as ${environmentVar} from "$app/environment"

globalThis.collectionsBuildEventEmitter = new ${EventEmitterVar}();
let ${collectionsFolderVar} = import.meta.env.collections
let ${builtCollectionsFolderVar} = import.meta.env.collectionsBuilt

async function ${dirWatcherVar}(watcher, dirPath) {
    let files = await readdir(dirPath)
    for(let file of files) {
        console.log(file)
        let fileStat = await ${statVar}(path.resolve(dirPath, file))
        await statReact(fileStat, path.resolve(dirPath, file))
    }
    for await (const event of watcher) {
        console.log(event)
        if(event.filename == null) continue
        if(event.eventType == "rename") {
            try {
                await rm(path.resolve(${builtCollectionsFolderVar}, event.filename.toString()))
            } catch(err) {
                
            }
        }
        console.log(event)
        globalThis.collectionsBuildEventEmitter.emit("dir-change", path.resolve(dirPath, event.filename.toString()))
    }
}

async function ${statReactVar}(fileStat, filePath) {
    console.log(filePath)
    if(fileStat.isDirectory()) {
        return
    }
    if(fileStat.isFile()) {
        if(filePath.endsWith("index.ts") || filePath.endsWith("index.js")) return
        try {
            await mkdir(path.resolve(process.cwd(), ${builtCollectionsFolderVar}), { recursive: true })
        } catch(err) {
            console.log(err)
        }
        try {
            await ${statVar}(filePath)
            ${WorkerVar}?.({workerData: {filePath}})?.on("exit", () => {
                globalThis.collectionsBuildEventEmitter.emit("build-done", filePath)
            })
        } catch {
        }
    }
}
(async () => {
    let watcher = watch(path.resolve(process.cwd(), ${collectionsFolderVar}), {
        recursive: true
    })
    dirWatcher(watcher, path.resolve(process.cwd(), ${collectionsFolderVar}))
})()
${code}`
            }
        }
    } satisfies vite.Plugin;

}
