<script lang="ts">
  export let fields: Array<any> = [];
  export let collection: Schema | undefined = undefined;
  export let showFields:boolean=true
  import { prevFormData, getFieldsData } from "@src/stores/store";
  import type { Schema } from "@src/collections/types";
  import { Button, CloseButton, Tooltip } from "flowbite-svelte";
  import Fields from "./Fields.svelte";
  import Icon from "@iconify/svelte";

  $: {
    $getFieldsData = new Set();
    collection;
  }
</script>

<div class="fields text-white bg-gray-800 p-4 rounded">
  <div class="flex justify-start mb-5 font-bold relative">
    <Icon icon={collection?.icon} color="dark" width="24" class="mr-1" />Create {collection?.name}
    <CloseButton class="absolute text-white right-0" on:click={()=>showFields=false}/>
    <Tooltip>Close without saving</Tooltip>
</div>
  <Fields {collection} {fields} />

<form on:submit|preventDefault enctype="multipart/form-data">
  <div class="my-2">
    <button><Button class="w-full" submit gradient color="lime"><Icon icon="ph:floppy-disk-back" color="dark" width="24" class="mr-1" />SAVE</Button><Tooltip placement="bottom" color="green">Save {collection?.name}</Tooltip></button>
  </div>
</form>
</div>
<style>
  :global(.fields .title) {
    color: white;
  }
  button{
    width:min(70%,200px)
  }
</style>
