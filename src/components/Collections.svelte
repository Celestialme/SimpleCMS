<script lang="ts">
  import type { Schema } from "@src/collections/types";
  import { shape_fields } from "@src/utils/utils_svelte";
  export let filterCollections: string;
  export let fields: Array<any>;
  export let collection: Schema;
  export let data: Array<any>;
  export let showFields: boolean;
  let expanded: any = {};

  function setHeight(node: HTMLDivElement) {
    let height = node.clientHeight;
    node.style.setProperty("--height", (height<=300?height:300) + "px");
    node.style.maxHeight = "0px";
    node.style.transition = " 0.5s";
  }
  function setOverflowY(e: MouseEvent, state: boolean) {
    let node: HTMLDivElement = e.target as HTMLDivElement;
    state ? setTimeout(() => (node.style.overflowY = "auto")) : setTimeout(() => (node.style.overflowY = "hidden"));
  }

  $: filtered = data && data.map((category) => ({ category: category.category, collections: category.collections.filter((collection: any) => collection.name.includes(filterCollections)) }));
  $: {
    if (filterCollections) {
      for (let index in expanded) {
        expanded[index] = true;
      }
    }
  }
</script>

{#each filtered as item, index}
  <div
    on:click={(e) => {
      expanded[index] = !expanded[index];
      expanded[index] ? setOverflowY(e, true) : setOverflowY(e, false);
    }}
    class="relative p-3 px-10 bg-[#ff7254] cursor-pointer text-center   arrow"
    class:arrow_up={expanded[index]}
  >
    {item.category}
  </div>
  <div use:setHeight class="overflow-hidden" class:expand={expanded[index]}>
    {#each item.collections as _collection}
      <p
        class="text-black cursor-pointer py-2 text-center bg-white hover:bg-[#65dfff] hover:text-white"
        on:click={() => {
          fields = shape_fields(_collection.fields);
          collection = _collection;
          showFields = false;
        }}
      >
        {_collection.name}
      </p>
    {/each}
  </div>
{/each}

<style>
  .expand {
    max-height: var(--height) !important;
  }
  .arrow::after {
    content: "";
    position: absolute;
    right: 0;
    top: 40%;
    transform: translateY(-50%);
    border: solid black;
    border-width: 0 3px 3px 0;
    display: inline-block;
    padding: 3px;
    transform: rotate(45deg);
    margin-right: 10px;
    transition: transform 0.1s ease-in;
  }
  .arrow_up::after {
    transform: rotate(225deg);
  }
</style>
