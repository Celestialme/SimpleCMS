import { build } from "vite"
import { watch, readdir, stat, mkdir, rm } from "fs/promises"
import EventEmitter from "events"
import path from "path"
import * as envPublic from "$env/static/public"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import * as environment from "$app/environment"
let folderUpdateEventEmitter = new EventEmitter();
let collectionsFolder = import.meta.env.collections
let builtCollectionsFolder = import.meta.env.collectionsBuilt

async function main() {
    let watcher = watch(path.resolve(process.cwd(), collectionsFolder), {
        recursive: true
    })
    dirWatcher(watcher, path.resolve(process.cwd(), collectionsFolder))
}

async function dirWatcher(watcher: Awaited<ReturnType<typeof watch>>, dirPath: string) {
    let files = await readdir(dirPath)
    for(let file of files) {
        console.log(file)
        let fileStat = await stat(path.resolve(dirPath, file))
        await statReact(fileStat, path.resolve(dirPath, file))
    }
    for await (const event of watcher) {
        console.log(event)
        if(event.filename == null) continue
        if(event.eventType == "rename") {
            try {
                await rm(path.resolve(builtCollectionsFolder, event.filename.toString()))
            } catch(err) {
                
            }
        }
        console.log(event)
        folderUpdateEventEmitter.emit("dir-change", path.resolve(dirPath, event.filename.toString()))
    }
}

async function statReact(fileStat: Awaited<ReturnType<typeof stat>>, filePath: string) {
    console.log(filePath)
    if(fileStat.isDirectory()) {
        return
    }
    if(fileStat.isFile()) {
        if(filePath.endsWith("index.ts") || filePath.endsWith("index.js")) return
        try {
            await mkdir(path.resolve(process.cwd(), builtCollectionsFolder), { recursive: true })
        } catch(err) {
            console.log(err)
        }
        try {
            await stat(filePath)
            await build({
                build: {
                    target: "esnext",
                    lib: {
                        entry: filePath,
                        name: filePath.replace(/^.*\//g, ""),
                        formats: ["es"],

                    },
                    outDir: path.resolve(process.cwd(), builtCollectionsFolder),
                    rollupOptions: {
                        output: {
                            exports: "named",
                            entryFileNames: "[name].js",
                            chunkFileNames: "[name]-[hash].js",
                            format: "es",
                            assetFileNames: "[name]-[hash].[ext]",
                        }
                    },
                    minify: false,
                    emptyOutDir: false
                },
                resolve: {
                    alias: {
                        "@src": path.resolve(process.cwd(), "src")
                    },
                },
                plugins: [
                    {
                        name: "svelte-imports",
                        resolveId(id) {
                            if(id === "$env/static/public") return id
                                if(id === "$app/environment") return id
                        },
                        load(id) {

                            if(id === "$env/static/public") return `
                                ${Object.entries(envPublic).map(([key, value]) => `export const ${key} = "${value}";`).join("\n")}
                            `
                            if(id === "$app/environment") return `
                                ${Object.entries(environment).map(
                                    ([key, value]) => `export const ${
                                        key
                                    } = "${
                                        key === "browser" ? "typeof document !== 'undefined'" : (
                                            key === "server" ? "typeof document === 'undefined'" : value
                                        )
                                    }";`
                                ).join("\n")}
                            `
                        },
                        transform(_, id) {
                            if(id.includes("widgets")) return "export default globalThis.widgets"
                        }
                    },
                    svelte(),
                ],
                configFile: false
            })
        } catch {
        }
        console.log("built")
    }
}

folderUpdateEventEmitter.on("dir-change", async (filePath) => {
    let fileStat = await stat(filePath)
    statReact(fileStat, filePath)
})
main()

export default main
