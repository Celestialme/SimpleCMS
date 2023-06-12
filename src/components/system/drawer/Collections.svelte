<script lang="ts">
	import { collection, categories } from '@src/collections';
	import { mode, switchSideBar } from '@src/stores/store';
	// import Tooltip from '@src/components/system/tooltip/Tooltip.svelte';

	import { Accordion, AccordionItem } from '@skeletonlabs/skeleton';
	import { popup } from '@skeletonlabs/skeleton';
	import type { PopupSettings } from '@skeletonlabs/skeleton';

	const popupHover: PopupSettings = {
		event: 'hover',
		target: 'popupHover',
		placement: 'top'
	};

	let expanded: any = {};
</script>

<!-- displays all collection parents and their Children as accordion -->
<div class="mt-2">
	<!-- TODO: Apply Tooltip for collapsed  -->
	<Accordion regionControl="bg-surface-500 uppercase text-white hover:!bg-surface-400" autocollapse>
		<!-- Collection Partents -->
		{#each categories as category, index}
			<AccordionItem open regionPanel="divide-y divide-black my-0" class="divide-y rounded-md bg-surface-100 dark:bg-surface-300">
				<svelte:fragment slot="lead">
					<iconify-icon icon={category.icon} width="24" class="text-red-600" />
				</svelte:fragment>

				<svelte:fragment slot="summary"
					>{#if $switchSideBar}
						<p>{category.name}</p>
					{/if}
					<div class="card variant-filled-secondary p-4" data-popup="popupHover">
						<p>Hover Content</p>
						<div class="arrow variant-filled-secondary" />
					</div>
				</svelte:fragment>

				<!-- Collection Children -->
				<svelte:fragment slot="content">
					{#each category.collections as _collection}
						{#if $switchSideBar}
							<!-- switchSideBar expanded -->
							<div
							          	class="-mx-4 flex flex-row items-center py-1 pl-3 hover:bg-surface-400 hover:text-white dark:text-black hover:dark:text-white"
							on:keydown	on:click={(e) => {
							          		mode.set('view');
							          		$collection = _collection;
							          	}}
							>
								<iconify-icon icon={_collection.icon} width="24" class="px-2 py-1 text-red-600" />
								<p class="mr-auto text-center capitalize">{_collection.name}</p>
							</div>
						{:else}
							<!-- switchSideBar collapsed -->
							<div
							          	class="-mx-4 flex flex-col items-center py-1 hover:bg-surface-400 hover:text-white dark:text-black hover:dark:text-white"
							on:keydown	on:click={(e) => {
							          		mode.set('view');
							          		$collection = _collection;
							          	}}
							>
								<p class="text-xs capitalize">{_collection.name}</p>
								<iconify-icon icon={_collection.icon} width="24" class="text-red-600" />
							</div>
						{/if}
					{/each}
				</svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>

	<!-- {#each categories as category, index}
		<div
			class="relative mb-1 h-[40px] cursor-pointer overflow-visible rounded-sm bg-[#363b4e] py-2 text-white"
			class:arrow_up={expanded[index]}
			on:keydown on:click={(e) => {
				expanded[index] = !expanded[index];
			}}
		>
			<div class="flex" class:justify-start={$switchSideBar}>
				{#if $switchSideBar}
					<iconify-icon icon={category.icon} width="24" class="px-2 text-red-600" />
					<p class="uppercase">{category.name}</p>
				{:else}
					<Tooltip text={category.name} position="right" active={!$switchSideBar} />
					<iconify-icon icon={category.icon} width="24" class="px-2 text-red-600" />
				{/if}
			</div>
		</div>

		<div class:expand={expanded[index]} class="wrapper">
			<div class={expanded[index] ? 'delayed-overflow' : 'overflow-hidden'}>
				{#each category.collections as _collection}
					<div
					          	class="{$switchSideBar
					          		? 'h-[40px]'
					          		: 'h-fit '} relative flex cursor-pointer items-center border-b border-gray-200 bg-[#777a89] text-center capitalize text-white last:mb-1 last:border-b-0 hover:bg-[#65dfff] hover:text-white dark:bg-gray-400 dark:text-white dark:hover:bg-[#65dfff] dark:hover:text-white"
					on:keydown	on:click={(e) => {
					          		mode.set('view');
					          		$collection = _collection;
					          	}}
					>
						{#if $switchSideBar}
							
							<div class="flex flex-row pl-4">
								<iconify-icon icon={_collection.icon} width="24" class="px-2 text-red-600" />
								<p class="mr-auto text-center capitalize">{_collection.name}</p>
							</div>
						{:else}
							
							<div class="bg- flex flex-col pl-4">
								<p class="text-center text-xs capitalize">{_collection.name}</p>
								<iconify-icon icon={_collection.icon} width="24" class="mt-2 px-2 text-red-600" />
							</div>
						{/if}
					</div>
				{/each}
			</div>
		</div>
	{/each}  -->
</div>
