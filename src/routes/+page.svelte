<script lang="ts">
  import collections, { categories } from "@src/collections";
  import { shape_fields, saveFormData } from "@src/utils/utils_svelte";
  import Form from "@src/components/Form.svelte";
  import EntryList from "@src/components/EntryList.svelte";
  import { prevFormData, credentials } from "@src/stores/store";
  import Collections from "@src/components/Collections.svelte";
  // Icons from https://icon-sets.iconify.design/
  import axios from "axios";
  import env from "@root/env";
  import { goto } from "$app/navigation";
  import { Button, DarkMode, Navbar, NavHamburger, Search, Sidebar, SidebarBrand, SidebarGroup, SidebarWrapper } from "flowbite-svelte";
  let valid = false;
  let collection = collections[0];
  let filterCollections=""
  let fields: any = shape_fields(collection.fields);
  let refresh: (collection: any) => Promise<any>;
  let showFields = false;
  let deleteEntry = async () => {};
  let deleteMode: boolean;
  axios
    .post(
      `${env.API}/validateSession`,
      { sessionId: $credentials.session },
      {
        headers: {
          "content-type": "multipart/form-data",
        },
      }
    )
    .then((response) => {
      if (response.data.status == 200) {
        $credentials = response.data;
        valid = true;
      } else {
        goto("/login");
      }
    });
  async function onSubmit(e: Event) {
    e.preventDefault();

    await saveFormData(collection);
    refresh(collection);
    showFields = false;
    $prevFormData = undefined;
  }

  $: {
    $prevFormData = undefined;
    collection;
  }
  let site = {
    name: "SimpleCMS",
    href: "/",
    img: "https://flowbite-svelte.com/images/flowbite-svelte-icon-logo.svg",
  };
  let toggleSideBar = false;
  function updateFilter(e:KeyboardEvent) {
    filterCollections = (e.target as HTMLInputElement).value;
  }
</script>

<div class="body">
  <Navbar class="dark:text-white " navDivClass="flex  justify-between items-center w-full max-w-full">
    <NavHamburger on:click={() => (toggleSideBar = !toggleSideBar)} />

    <div class="dark:text-white hidden md:block mr-auto ">
      <SidebarBrand {site} aClass="flex items-center pl-2.5" />
    </div>
    
    <Button
      gradient
      color={deleteMode ? "red" : "green"}
      class="ml-auto"
      on:click={() => {
        deleteMode ? deleteEntry() : (showFields = true);
      }}>{deleteMode ? "delete" : "create"}</Button
    >
   
    <DarkMode />
  </Navbar>
  <div class="flex relative ">
    {#if valid}
      <div hidden={toggleSideBar}  class="controlls text-white absolute md:relative  left-0 top-0 z-10 md:block">
        <Sidebar id="sidebarLeft">
          <SidebarWrapper class="border-r-2 ">
            <SidebarGroup bind:fields bind:collection bind:showFields>
              <SidebarBrand {site} />
              <Search size="md" placeholder="Search ..."  on:keyup={updateFilter}/>
             
              <Collections data={categories} {filterCollections} bind:fields bind:collection bind:showFields />
           
            </SidebarGroup>
          </SidebarWrapper>
        </Sidebar>
      </div>

      <div class="content">
        {#if showFields}
          <Form {fields} {collection} on:submit={onSubmit} />
        {/if}

        <div hidden={showFields}>
          <EntryList bind:showFields bind:deleteEntry bind:deleteMode {collection} bind:refresh />
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .body {
    display: flex;
    flex-direction: column;
  }
  .content {
    margin: 0 auto;
    min-width: 30%;
    max-width: 2000px;
  }
  :global(.content > *) {
    margin: 5px 0;
  }

  :global(html, body, body > div, .body) {
    width: 100vw;
    height: 100vh;
    background-color: #3c3c3c;
    overflow: hidden;
  }
</style>
