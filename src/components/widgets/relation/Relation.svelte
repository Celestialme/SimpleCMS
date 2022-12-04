<script lang="ts">
  import Fields from "@src/components/Fields.svelte";
  import {findById, find } from "@src/utils/utils";
  import { shape_fields, saveSimpleData } from "@src/utils/utils_svelte";
  import { prevFormData, getFieldsData } from "@src/stores/store";
  import DropDown from "@src/components/DropDown.svelte";
  import { Button } from "flowbite-svelte";
  export let field: any;
  export let value: any;
  export let widgetValue = value; // is relative data id
  export let root:boolean=true
  let expanded: boolean = false;
  let inputFields: HTMLDivElement[] = [];
  let fieldsValue={};
  let showDropDown = false;
  let selectedField: any;
  let selected: any;
  $: selected ? (selectedField = selected.item,widgetValue=selected._id) : (selectedField = null);
  let dropDownData: any = [];
  let display: any;
  console.log($prevFormData);
  let getData = async () => {
    let obj: any = {};
    if (!selected) {
      let relationField = fieldsValue
      widgetValue = (await saveSimpleData(field.relation, relationField, widgetValue, !widgetValue)).data[0]?._id || widgetValue;
    } else {
      widgetValue = selected._id;
    }
    console.log(selected);
    obj[field.title] = widgetValue;
   if(root) return obj;
  };
  (async () => {
    if (value && typeof value == "string") {
      console.log(value)
      value = await findById(value, field.relation);
      //if we dont have display from entrylist already, generate new one
      display = (value && $prevFormData?.displays?.[field.title]) || (value && (await field.display(widgetValue, field, $prevFormData)));
    }
  })();

  if(root)  $getFieldsData.add(getData); // extra push needed because getData gets pushed to executed functions when fields are expanded so choosing wont work without.
</script>

{#if !expanded}
  <div class="flex bg-white py-1 items-center justify-center gap-1 rounded-lg">
    <p
      on:click={async () => {
        !dropDownData.length && (dropDownData = await find({}, field.relation));
        showDropDown = !showDropDown;
      }}
      class="w-full text-center cursor-pointer"
    >
      {selectedField || display || "Chose existing..."}
    </p>
    <Button
      on:click={() => {
        value = null;
        widgetValue = null;
        selected = null;
        display = null;
      }}
      class="btn btn-small">D</Button
    >
    <Button
      on:click={() => {
        expanded = !expanded;
        selected = null;
      }}
      class=" mr-1 btn btn-small">{value ? "✎" : "+"}</Button
    >
    <DropDown bind:showDropDown {dropDownData} bind:selected display={field.rawDisplay} />
  </div>
{:else}
  <div class="p-[20px] my-4 rounded-lg border-2 border-[#8cccff] relative">
    <Button
      on:click={() => {
        expanded = !expanded;
        selected = null;
      }}
      size="xs"
      gradient
      color="red"
      class="z-10 top-0  absolute right-0">X</Button
    >
    <Fields {getData} bind:inputFields bind:fieldsValue value={selected || value} fields={shape_fields(field.relation.fields)} />
  </div>
{/if}
