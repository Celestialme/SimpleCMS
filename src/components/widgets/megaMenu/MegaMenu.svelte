<script lang="ts">
import Fields from "@src/components/Fields.svelte";
import { get_fields } from "@src/utils/utils_svelte";
import {prevFormData,MenuCurrentChild} from "@root/stores/store"

import ListNode from "./ListNode.svelte";
    import { getInputFieldsData } from "@src/utils/utils";
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
        <ul class="menu bg-base-100  rounded-box">
            {#if !value}
                <li><div> <button on:click|preventDefault|stopPropagation={()=>{depth=0,showLevelContent=!showLevelContent}} class="ml-auto btn btn-sm">+</button></div></li>
            
            {:else}
               <ListNode children = {value.children} self={value} bind:editing bind:showLevelContent bind:depth/>
           
            {/if}

        </ul>

    </div>

        <div class="border-white border-solid border-4 p-2"  hidden={!showLevelContent}>
          
            <Fields  bind:inputFields={inputFields} value={editing?$MenuCurrentChild:null}  fields={get_fields(menu[depth])} {getData}/>
        </div>



