import { error } from "@sveltejs/kit"
import type { RequestHandler } from "./$types"
import { readFile } from "fs/promises"

export const GET: RequestHandler = async ({params}) => {
    try {
        console.log(params.path)
        return new Response(await readFile(`/${params.path}.js`), {
            headers: {
                "Content-Type": "application/javascript"
            }
        })
    } catch {
        throw error(404, "File not found")
    }
    
}
