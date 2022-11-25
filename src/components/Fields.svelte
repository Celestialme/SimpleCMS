<script lang="ts">

export let fields:Array<any> =[]
import {prevFormData,getFieldsData} from "@src/stores/store"
import type { Schema } from "@src/collections/types";
    import { getInputFieldsData } from "@src/utils/utils";
    import { onMount } from "svelte";
export let value:any=undefined;
export let collection:Schema|undefined=undefined;
export let inputFields:Array<HTMLDivElement>=[];
export let  getData=async ()=>{
    return  getInputFieldsData(inputFields,fields)
}
 
onMount(async ()=>{
    $getFieldsData.add(getData)
    console.log($getFieldsData)
})
 
    

</script>
{#each fields as field,index}
<div bind:this={inputFields[index]} class="section my-2 relative">
            <p class="title">{field.field.title}</p>
            <svelte:component this={field.widget} {collection} value={value?value?.[field.field.title]:$prevFormData?.[field.field.title]||""} field={field.field}/>
</div>
    {/each}
