import {writable, type Writable} from "svelte/store"
export let prevFormData:any = writable(undefined)
export let MenuCurrentChild:Writable<any> =writable(undefined)
export let getFieldsData:Writable<Array<()=>Promise<any>>> = writable([])
