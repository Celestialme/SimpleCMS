<script lang="ts">
    import collections from "@src/collections";
    import { get_fields,saveFormData } from "@src/utils/utils_svelte";
    import Form from "@src/components/Form.svelte"
    import EntryList from "@src/components/EntryList.svelte"
    // Icons from https://icon-sets.iconify.design/
    import Icon from "@iconify/svelte";
    let collection = collections[0];
    let fields:any = get_fields(collection)
    let refresh:(collection: any) => Promise<any>;

        
  async function  onSubmit(e: Event){
    e.preventDefault()
    
   await saveFormData(collection)
   refresh(collection)
   
    }
</script>
<div class="body">
    <div class="controlls text-white">
        {#each collections as _collection}
        <p class="cursor-pointer my-1" on:click={()=>{fields = get_fields(_collection);collection =_collection;}}>{_collection.name}</p>
        {/each}
    </div>


    <div class="content">
        <Form {fields} {collection} on:submit={onSubmit}></Form>
        <EntryList {collection}  bind:refresh/>

    </div>
    <label id="modal_action" for="form_modal" class="btn btn-success modal-button">Create New</label>
</div>


<style>
    .body{
        display:flex;
    }
    .content{
      margin:auto;
    }
    :global(.content > *){
        margin:5px 0;
    }
</style>