<script lang="ts">
	import Icon from '@iconify/svelte';
	import type { Schema } from '@src/collections/types';
	import { shape_fields } from '@src/utils/utils_svelte';
	import { Tooltip } from 'flowbite-svelte';
	export let filterCollections: string;
	export let fields: Array<any>;
	export let collection: Schema;
	export let data: Array<any>;
	export let showFields: boolean;
	export let category: string = '';
	export let switchSideBar = true;
	let expanded: any = {};

	function setHeight(node: HTMLDivElement) {
		let height = node.clientHeight;
		node.style.setProperty('--height', (height <= 300 ? height : 300) + 'px');
		node.style.maxHeight = '0px';
		node.style.transition = ' 0.5s';
	}
	function setOverflowY(e: MouseEvent, state: boolean) {
		let node: HTMLDivElement = e.target as HTMLDivElement;
		state
			? setTimeout(() => (node.style.overflowY = 'auto'))
			: setTimeout(() => (node.style.overflowY = 'hidden'));
	}

	$: filtered =
		data &&
		data.map((category) => ({
			category: category.category,
			icon: category.icon,
			collections: category.collections.filter((collection: any) =>
				collection.name.toLowerCase().includes(filterCollections)
			)
		}));
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
		class="arrow relative h-[40px] cursor-pointer overflow-visible rounded bg-gray-500 py-2 text-center"
		class:arrow_up={expanded[index]}
	>
		<Icon
			icon={item.icon}
			width="24"
			class="absolute top-[50%] left-0 mr-2 ml-2 -translate-y-[50%]"
		/>

		{#if switchSideBar}
			<div class="name">{item.category}</div>
		{/if}
	</div>
	{#if !switchSideBar}
		<Tooltip placement="right">{item.category}</Tooltip>
	{/if}

	<div use:setHeight class="overflow-hidden" class:expand={expanded[index]}>
		{#each item.collections as _collection}
			<p
				class="relative cursor-pointer border-b bg-white py-2 text-center text-black hover:bg-[#65dfff] hover:text-white"
				on:click={async () => {
					fields = await shape_fields(_collection.fields);
					category = item.category;
					collection = _collection;
					showFields = false;
				}}
			>
				{#if switchSideBar}
					<div class="flex h-[40px] items-center justify-center">
						<Icon
							icon={_collection.icon}
							width="24"
							class="h-40px absolute top-[50%] left-0 ml-2 -translate-y-[50%] text-red-700 "
						/>
						{_collection.name}
					</div>
				{:else}
					<div class="flex flex-col py-1 ">
						<Icon icon={_collection.icon} width="24" class="m-auto text-red-700 " />
						<div class="overflow-clip truncate text-clip text-[9px]">
							{_collection.name}
						</div>
					</div>
				{/if}
			</p>
			{#if !switchSideBar}
				<Tooltip placement="right" class="absolute">{_collection.name}</Tooltip>
			{/if}
		{/each}
	</div>
{/each}

<style>
	.expand {
		max-height: var(--height) !important;
	}
	.arrow::after {
		content: '';
		position: absolute;
		right: 0;
		top: 40%;
		transform: translateY(-50%);
		border: solid white;
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
