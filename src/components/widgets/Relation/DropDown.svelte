<script lang="ts">
	import Input from '@src/components/system/inputs/Input.svelte';
	import type { FieldType } from '.';
	import { collection, entryData } from '@src/stores/store.svelte';
	import { contentLanguage } from '@src/stores/store.svelte';
	interface Props {
		dropDownData?: any[];
		selected?: { display: any; _id: any } | undefined;
		field: FieldType | undefined;
		showDropDown?: boolean;
	}

	let {
		dropDownData = [],
		selected = $bindable(undefined),
		field,
		showDropDown = $bindable(true)
	}: Props = $props();
	let search = $state('');
	let options: Array<{ display: any; _id: any }> = $state([]);
	let filtered = $derived(options.filter((item) => item.display?.includes(search)));

	$effect(() => {
		Promise.all(
			dropDownData.map(async (item) => ({
				display: await field?.display({
					data: item,
					collection: collection(),
					field,
					entry: entryData(),
					contentLanguage: contentLanguage()
				}),
				_id: item._id
			}))
		).then((res) => (options = res));
	});
</script>

<Input inputClass="w-full" placeholder="search..." bind:value={search} />
<div class="overflow-auto">
	{#each filtered as option}
		<p
			onclick={() => {
				selected = option;
				showDropDown = false;
			}}
			class="item"
		>
			{@html option.display}
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
