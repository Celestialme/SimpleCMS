<script lang="ts">
import Fields from "@src/components/Fields.svelte";
import { get_fields } from "@src/utils/utils_svelte";
import {prevFormData,MenuCurrentChild} from "@src/stores/store"

import ListNode from "./ListNode.svelte";
    import { getInputFieldsData } from "@src/utils/utils";
    import { Button } from "flowbite-svelte";
export let field:any
export let value:any={}


let editing:boolean = false
let menu = field.menu
let showLevelContent = false;
let depth =0
let inputFields:Array<HTMLDivElement>=[];
MenuCurrentChild.subscribe((_)=>{
    value =value // refresh tree when editing/deleting
})
let getData= async()=>{
    if(!showLevelContent && !editing){
        return
    }
    let data:any = getInputFieldsData(inputFields,get_fields(menu[depth]))
    
    let formData:any = {}
    if(depth==0&&!editing){ //creating parent
        data.children =[]
        data = JSON.stringify(data)
        formData[field.title]=data
    }else{
       !Array.isArray($MenuCurrentChild.children)&&($MenuCurrentChild.children=[])
       if(editing){ //editing child
            for(let key in data){
                $MenuCurrentChild[key]=data[key]
            }
          
       }else{
            data = JSON.stringify(data) //adding children to child
             $MenuCurrentChild.children.push(data)
       }
       formData[field.title]=JSON.stringify(value)
    }
    return formData
}
</script>

    <div hidden={showLevelContent}>
        <ul class="menu bg-white rounded-md">
            {#if !value}
                <li><div> <Button on:click={()=>{depth=0,showLevelContent=!showLevelContent}} class="ml-auto btn btn-sm">+</Button></div></li>
            
            {:else}
               <ListNode children = {value.children} self={value} bind:editing bind:showLevelContent bind:depth/>
           
            {/if}

        </ul>

    </div>

        <div class="p-[20px] my-4 rounded-lg border-2 border-[#8cccff] relative"  hidden={!showLevelContent}>
            <Button on:click={()=>{showLevelContent = !showLevelContent;editing=false}} size="xs"  gradient color="red" class="z-10 top-0  absolute right-0">X</Button>
            <Fields  bind:inputFields={inputFields} value={editing?$MenuCurrentChild:null}  fields={get_fields(menu[depth])} {getData}/>
        </div>



