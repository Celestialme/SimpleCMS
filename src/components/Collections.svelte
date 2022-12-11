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
				collection.name.includes(filterCollections)
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
		class="relative overflow-visible rounded py-2 bg-gray-500 cursor-pointer text-center arrow h-[40px]"
		class:arrow_up={expanded[index]}
	>

	<Icon icon={item.icon} width="24" class="mr-2 absolute top-[50%] left-0 -translate-y-[50%] ml-2" />

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
				class="text-black cursor-pointer py-2 text-center bg-white hover:bg-[#65dfff] hover:text-white relative border-b"
				on:click={async () => {
					fields = await shape_fields(_collection.fields);
					category = item.category;
					collection = _collection;
					showFields = false;
				}}
			>
				{#if switchSideBar}
					<div class="h-[40px] flex justify-center items-center">
						<Icon
							icon={_collection.icon}
							width="24"
							class="text-red-700 h-40px absolute top-[50%] left-0 -translate-y-[50%] ml-2 "
						/>
						{_collection.name}
					</div>
				{:else}
					<div class="flex flex-col py-1 ">
						<Icon icon={_collection.icon} width="24" class="text-red-700 m-auto " />
						<div class="text-[9px] text-clip truncate overflow-clip">
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
