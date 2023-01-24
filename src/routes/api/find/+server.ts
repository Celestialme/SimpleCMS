import type {RequestHandler} from './$types'
import {collections} from "@src/routes/api/db"
export  const GET:RequestHandler  = async ({ url }) => {
  let collection = collections[url.searchParams.get("collection") as string];
  // return new Response(await collection.find(url.searchParams.get("id") as string))
  let resp =  JSON.stringify(await collection.find(JSON.parse(url.searchParams.get("query")  as string)));
  return new Response(resp)
  }

