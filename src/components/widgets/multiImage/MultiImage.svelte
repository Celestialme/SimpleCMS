<script lang="ts">
  import Fields from "@src/components/Fields.svelte";
  import { getInputFieldsData } from "@src/utils/utils";
  import { saveSimpleData, shape_fields } from "@src/utils/utils_svelte";
  import { prevFormData } from "@src/stores/store";
  export let field = { title: "", fields: [] };
  export let collection: any;
  export let value: any;
  let _inputFields:any = [];
  let fields = shape_fields(field.fields);
  let files: any = [];

  let getData = async () => {
    for (let i = 0; i < files.length; i++) {
      let fieldsData = getInputFieldsData(_inputFields[i], fields);
      await saveSimpleData(collection, fieldsData);
    }
    if(!files.length){ // if no files currently beeing chosen, means we are editing, should update.
      let fieldsData = getInputFieldsData(_inputFields, fields);
      await saveSimpleData(collection, fieldsData);
    }
  };
</script>

{#if files.length > 0}
  {#each files as file,index}
  <div class="p-[20px] my-4 rounded-lg border-2 border-[#8cccff] relative">
    <Fields {getData} {collection} {fields} bind:inputFields = {_inputFields[index]} value={{image2:file}} />
  </div>
  {/each}
{:else if $prevFormData}

<Fields {getData} {collection} {fields} bind:inputFields = {_inputFields} value={value} />
{:else}
  <input bind:files name={field.title} multiple class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400" type="file" />
{/if}

<style>
</style>
