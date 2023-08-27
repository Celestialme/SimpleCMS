import type { RequestHandler } from "./$types"
import { json } from "@sveltejs/kit"
import { getCollectionsFile } from "."

export const GET: RequestHandler = async () => {
    return json(await getCollectionsFile())
}
