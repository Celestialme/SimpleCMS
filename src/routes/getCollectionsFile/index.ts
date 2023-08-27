import { browser } from "$app/environment"

export async function getCollectionsFile() {
    if(browser) {
        return fetch("/getCollectionsFile").then(res => res.json())
    }
    const { default: fs } = await import("fs")
    const { default: path } = await import("path")

    let files = await fs.promises.readdir(import.meta.env.collectionsBuilt)
    let collections = files.map(
            file => path.resolve(import.meta.env.collectionsBuilt, file)
        ).filter(
            file => fs.statSync(file).isFile() && (file.endsWith("js") || file.endsWith("ts"))
        ).map(
            file => ({ path: file
                     .replace(
                    import.meta.env.appRoot, ""),
                    name: file
                        .replace(/^.*\//g, "")
                        .replace(/\.[^\.]+$/, "")
                })
        )
    return collections
}
