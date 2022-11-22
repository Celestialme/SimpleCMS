<script lang="ts">
    export let fields:Array<any>=[]
    export let collection:Schema|undefined=undefined;
    import {prevFormData,getFieldsData} from "@root/stores/store"
    import type { Schema } from "@src/collections/types";
    import Fields from "./Fields.svelte"
    let button:HTMLButtonElement
    let checked:boolean =false

$:{$getFieldsData=new Set()
    collection,
    checked
}

let check = (e: any) =>{
if(e.target.checked ==true) $prevFormData=undefined
checked=e.target.checked
}
</script>

       



<input type="checkbox" on:change={check} id="form_modal" class="modal-toggle" />
<label for="form_modal" class="modal cursor-pointer">
  <label class="modal-box relative bg-gray-700" for="">
    <div class="fields">
        {#key checked}
        <Fields {collection} {fields}/>
        {/key}
    </div>
    <form  on:submit|preventDefault enctype="multipart/form-data">
        <div class="my-2">

            <label on:click={()=>button.click()} for="form_modal2" class="btn btn-success">Save</label>
            <button bind:this={button} hidden></button>
        </div>
    
    </form>
  </label>
</label>

<style>
    :global(.fields .title){
        color:white;

    }
</style>