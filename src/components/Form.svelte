<script lang="ts">
    export let fields:Array<any>=[]
    export let collection:Schema|undefined=undefined;
    import {prevFormData,getFieldsData} from "@src/stores/store"
    import type { Schema } from "@src/collections/types";
    import { Button } from "flowbite-svelte";
    import Fields from "./Fields.svelte"

$:{$getFieldsData=new Set()
    collection

}

</script>

       




    <div class="fields">
    
        <Fields {collection} {fields}/>
      
    </div>
    <form  on:submit|preventDefault enctype="multipart/form-data">
        <div class="my-2">
          <button><Button submit gradient  color="lime">SAVE</Button></button>
        </div>
    
    </form>


<style>
    :global(.fields .title){
        color:white;

    }
</style>