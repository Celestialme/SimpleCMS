<script lang="ts">
	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	import { collection, categories } from '@src/collections';
	import { language, mode, switchSideBar } from '@src/stores/store';
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
	<Accordion regionControl="bg-surface-500 uppercase text-white hover:!bg-surface-400">
		<!-- Collection Parents -->
		{#each categories as category, index}
			<AccordionItem regionPanel="divide-y divide-black my-0" class="divide-y rounded-md bg-surface-100 dark:bg-surface-300">
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
								on:keydown
								on:click={(e) => {
									mode.set('view');
									$collection = _collection;
								}}
							>
								<iconify-icon icon={_collection.icon} width="24" class="px-2 py-1 text-error-600" />
								<p class="mr-auto text-center capitalize">{_collection.name}</p>
							</div>
						{:else}
							<!-- switchSideBar collapsed -->
							<div
								class="-mx-4 flex flex-col items-center py-1 hover:bg-surface-400 hover:text-white dark:text-black hover:dark:text-white"
								on:keydown
								on:click={(e) => {
									mode.set('view');
									$collection = _collection;
								}}
							>
								<p class="text-xs capitalize">{_collection.name}</p>
								<iconify-icon icon={_collection.icon} width="24" class="text-error-600" />
							</div>
						{/if}
					{/each}
				</svelte:fragment>
			</AccordionItem>
		{/each}
	</Accordion>

	<!-- Gallery -->
	{#if $switchSideBar}
		<!-- switchSideBar expanded -->
		<a on:keydown href="/{language}/mediagallery" class="btn mt-1.5 flex flex-row items-center justify-start bg-surface-600 py-2 pl-2 text-white">
			<iconify-icon icon="bi:images" width="24" class="px-2 py-1 text-primary-600" />
			<p class="mr-auto text-center uppercase">{$LL.Media()}</p>
		</a>
	{:else}
		<!-- switchSideBar collapsed -->
		<a on:keydown href="/mediagallery" class="btn variant-filled-surface mt-2 flex flex-col items-center py-1 pl-2">
			<p class="text-xs uppercase">{$LL.Media()}</p>
			<iconify-icon icon="bi:images" width="24" class="text-primary-600" />
		</a>
	{/if}
</div>
