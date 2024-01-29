<script lang="ts">
	import Input from '@src/components/system/inputs/Input.svelte';
	import type { FieldType } from '.';
	import { entryData } from '@src/stores/store';
	import { collection, contentLanguage } from '@src/stores/load';
	export let dropDownData: any[] = [];
	export let selected: { display: any; _id: any } | undefined = undefined;
	export let field: FieldType | undefined;
	export let showDropDown = true;
	let search = '';
	let options: Array<{ display: any; _id: any }> = [];
	let filtered = options;
	console.log(dropDownData);
	$: Promise.all(
		dropDownData.map(async (item) => ({
			display: await field?.display({ data: item, collection: $collection, field, entry: $entryData, contentLanguage: $contentLanguage }),
			_id: item._id
		}))
	).then((res) => (options = res));
	$: filtered = options.filter((item) => item.display?.includes(search));
</script>

<Input inputClass="w-full" placeholder="search..." bind:value={search} />
<div class="overflow-auto">
	{#each filtered as option}
		<p
			on:click={() => {
				selected = option;
				showDropDown = false;
			}}
			class="item"
		>
			{option.display}
		</p>
	{/each}
</div>

<style>
	.item {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 2px;
		border: 1px solid #8080807d;
		border-radius: 5px;
		padding: 10px 0px;
		padding-left: 50px;
		padding-right: 10px;
		margin-top: 5px;
		cursor: pointer;
	}
	.item:hover {
		border-color: aqua;
	}
</style>
