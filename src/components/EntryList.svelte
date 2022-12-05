<script lang="ts">
  import axios from "axios";
  import env from "@root/env";
  import { prevFormData } from "@src/stores/store";
  import { onMount } from "svelte";
  import DeleteIcon from "./icons/DeleteIcon.svelte";
  import { Button, Table, TableBody, TableBodyCell, TableBodyRow, TableHead, TableHeadCell, TableSearch } from "flowbite-svelte";
  import Icon from "@iconify/svelte";
  export let showFields = false;
  export let collection: any = undefined;
  export let deleteMode = false;
  export let category = "Some";
  let entryList: any = [];
  let deleteMap: any = {};
  let deleteAll = false;
  $: process_deleteAll(deleteAll);
  $: deleteMode = Object.values(deleteMap).includes(true);
  let refresh_deleteMap = (_: any) => {
    deleteMap = {};
  };
  $: refresh_deleteMap(collection);
  export let refresh: (collection: any) => Promise<any>;
  onMount(() => {
    refresh = async (collection: any) => {
      entryList = [];
      entryList = await axios.get(`${env.HOST}:${env.PORT}/api/${collection.name}`).then((data) => data.data);
      deleteMap = {};
    };
  });
  $: refresh && refresh(collection);

  export async function deleteEntry() {
    deleteAll = false;
    let deleteList: Array<string> = [];
    for (let item in deleteMap) {
      deleteMap[item] && deleteList.push(entryList[item]._id);
    }
    if (deleteList.length == 0) return;
    let formData = new FormData();
    formData.append("ids", JSON.stringify(deleteList));
    await axios.delete(`${env.HOST}:${env.PORT}/api/${collection.name}`, { data: formData });
    refresh(collection);
  }
  let filter: any = "";
  let filtered_entryList = [...entryList];
  $: {
    filtered_entryList = entryList.filter((item: object) => {
      return filter ? Object.values(item).some((x) => x.toString().includes(filter)) : true;
    });
    filter;
  }

  function process_deleteAll(deleteAll: boolean) {
    if (deleteAll) {
      for (let item in entryList) {
        deleteMap[item] = true;
      }
    } else {
      for (let item in deleteMap) {
        deleteMap[item] = false;
      }
    }
  }
</script>

<div class="relative">
  <div class="flex gap-2 mb-2 items-center">
    <div class="flex flex-col w-80">
      <div class="text-gray-400 text-xs d-flex capitalize mb-2">{category}</div>
      <div class="text-white font-bold uppercase flex justify-start items-center ">
        <span> <Icon icon={collection.icon} color="white" width="24" class="mr-2" /></span>{collection.name}
      </div>
    </div>

    <!-- Search box -->
    <div class="flex justify-center items-center ">
      <TableSearch placeholder="Search {collection.name} ..." hoverable={true} bind:inputValue={filter} />
    </div>
  </div>
  <Table hoverable={true} class="relative">
    <TableHead>
      <TableHeadCell>Index</TableHeadCell>
      {#each collection.fields as field}
        <TableHeadCell class="text-center">{field.title}</TableHeadCell>
      {/each}
      <TableHeadCell class="text-right"><DeleteIcon bind:checked={deleteAll} class="ml-auto mr-[25px]" /></TableHeadCell>
    </TableHead>
    <TableBody class="divide-y">
      {#each filtered_entryList as entry, index}
        <TableBodyRow
          on:click={() => {
            showFields = true;
            $prevFormData = entry;
          }}
        >
          <TableBodyCell>{index + 1}</TableBodyCell>

          {#each collection.fields as field}
            {#await field?.display?.(entry[field.title], field, entry)}
              <TableBodyCell class="text-center">Loading...</TableBodyCell>
            {:then display}
              {((entry.displays = {}), "")}
              <TableBodyCell class="text-center">{@html (entry.displays[field.title] = display)}</TableBodyCell>
            {/await}
          {/each}
          <TableBodyCell>
            <DeleteIcon bind:checked={deleteMap[index]} class="ml-auto mr-[25px]" />
          </TableBodyCell>
        </TableBodyRow>
      {/each}
    </TableBody>
  </Table>
</div>
