<script lang="ts">
  import { prevFormData, getFieldsData } from "@src/stores/store";
  import type { Schema } from "@src/collections/types";
  import { onMount } from "svelte";
  import Icon from "@iconify/svelte";
  export let root: boolean = true; // if field is not nested. eg. not part of menu's fields
  export let fields: Array<any> = [];
  export let value: any = undefined;
  export let collection: Schema | undefined = undefined;
  export let inputFields: Array<HTMLDivElement> = [];
  export let fieldsValue: any = {};
  export let getData = async () => {
    return fieldsValue;
  };

  onMount(async () => {
    $getFieldsData.add(getData);
  });
</script>

{#each fields as field, index}
  <div bind:this={inputFields[index]} class="section my-2 relative">
    <div class="text-white font-bold flex capitalize">
      <p class="mb-2">{field.field.title}</p>
      {#if field.field.icon}
        <Icon icon={field.field.icon} color="white" width="24" class="absolute right-0" />
      {/if}
    </div>
    <svelte:component this={field.widget} {collection} bind:widgetValue={fieldsValue[field.field.title]} {root} value={value ? value?.[field.field.title] : $prevFormData?.[field.field.title] || ""} field={field.field} />
  </div>
{/each}
