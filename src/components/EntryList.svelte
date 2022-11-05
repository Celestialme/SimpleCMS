<script lang="ts">
    import axios from "axios";
    import env  from '@root/env'
    import { prevFormData} from "@root/stores/store"
    import { onMount } from "svelte";
    import DeleteIcon from "./icons/DeleteIcon.svelte";
    export let collection:any=undefined;
    let entryList:any=[];   
    let deleteMap:any={}
    let refresh_deleteMap = (_:any)=>{
      deleteMap={}
    }
    $:refresh_deleteMap(collection);
    export let refresh:(collection: any) => Promise<any>
    onMount( ()=>{
        refresh = async (collection:any)=>{
          entryList=[];   
        entryList =  await axios.get(`${env.HOST}:${env.PORT}/api/${collection.name}`).then(data=>data.data);
        deleteMap={}
        
      }
        


    })
$:refresh&&refresh(collection)

async function deleteEntry(){
  let deleteList:Array<string>=[]
  for (let item in deleteMap){
    deleteMap[item] && deleteList.push(entryList[item]._id)
  }
  if(deleteList.length==0)return
  let formData =  new FormData()
  formData.append("ids", JSON.stringify(deleteList)) 
  await axios.delete(`${env.HOST}:${env.PORT}/api/${collection.name}`,{data:formData})
  refresh(collection)

}
let a:any
</script>


<div class="overflow-x-auto w-[50vw]">
    <table class="table w-full">
      <thead>
        <tr>
          <th >Index</th>
          {#each collection.fields as field}
          <th class="text-center">{field.title}</th>
         {/each}
         <th class="text-right"><button on:click={deleteEntry} class="btn btn-sm">DELETE</button></th>
        </tr>
      </thead>
      <tbody>


    {#each entryList as entry,index}
        <tr on:click={()=>{document.getElementById("modal_action")?.click();$prevFormData=entry}}>
            <th>{index+1}</th>
    
       
            {#each collection.fields as field}
              {#await  field?.display?.(entry[field.title],field,entry)}
              <td class="text-center">Loading...</td>
              {:then display}
                {entry.displays ={},""}
                <td class="text-center">{ @html entry.displays[field.title]= display }</td>
                {/await}
            {/each}
            <th>
          
              <DeleteIcon bind:checked={deleteMap[index]} class="ml-auto mr-[20px]"/>
        
            </th>
        </tr>
    {/each}

      </tbody>
    </table>
  </div>
  
  <style>
    tbody tr:hover *{
      background: #e0e0e0;
    }
  </style>