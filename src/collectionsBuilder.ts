import { build } from "vite"
import { workerData as _workerData, isMainThread } from "worker_threads"
import { stat } from "fs/promises"
import path from "path"
import * as envPublic from "$env/static/public"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import * as environment from "$app/environment"
let builtCollectionsFolder = import.meta.env.collectionsBuilt
console.log(isMainThread)

export default async function main({workerData = _workerData} = {}) {
    const { filePath } = workerData ?? {}
    if(filePath == null) return
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
}
if(!isMainThread && _workerData?.filePath) {
    main()
}
