import path from "path"
import fs from "fs"
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
                while(code.includes(WorkerVar)) {
                    WorkerVar += "_"
                }
                firstSSR = false
                return `import ${WorkerVar} from "${
new Array(id.replace(process.cwd(), "").split("/").length - 2).fill("..").join("/") 
                    + "/src/collectionsBuilder"
                }?nodeWorker"
${WorkerVar}?.();
${code}`
            }
        }
    } satisfies vite.Plugin;

}
