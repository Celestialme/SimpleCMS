<script lang="ts">
  import collections, { categories } from "@src/collections";
  import { get_fields, saveFormData } from "@src/utils/utils_svelte";
  import Form from "@src/components/Form.svelte";
  import EntryList from "@src/components/EntryList.svelte";
  import { prevFormData, credentials } from "@src/stores/store";
  import Collections from "@src/components/Collections.svelte";
  // Icons from https://icon-sets.iconify.design/
  import axios from "axios";
  import env from "@root/env";
  import { goto } from "$app/navigation";
  let valid = false;
  let collection = collections[0];
  let fields: any = get_fields(collection);
  let refresh: (collection: any) => Promise<any>;
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
  let showFields = false;
  $: {
    $prevFormData = undefined;
    collection;
  }
</script>

<div class="body">
  {#if valid}
    <div class="controlls text-white">
      <Collections
        data={categories}
        bind:fields
        bind:collection
        bind:showFields
      />
    </div>

    <div class="content">
      {#if showFields}
        <Form {fields} {collection} on:submit={onSubmit} />
      {/if}

      <div hidden={showFields}>
        <EntryList bind:showFields {collection} bind:refresh />
      </div>
    </div>
  {/if}
</div>

<style>
  .body {
    display: flex;
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
