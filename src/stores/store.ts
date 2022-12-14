import {writable, type Writable} from "svelte/store"
export let entryData:any = writable(undefined)
export let MenuCurrentChild:Writable<any> =writable(undefined)
export let getFieldsData:Writable<Set<()=>Promise<any>>> = writable(new Set())
export let credentials:Writable<{username:string,session:string}>= writable(JSON.parse(window.localStorage.getItem("credentials") ||'{"username":null,"session":null}'))
credentials.subscribe((val)=>{
    window.localStorage.setItem("credentials", JSON.stringify(val))
})