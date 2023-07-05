<script lang="ts">
	import { toggleLeftSidebar } from '@src/stores/store';
	import { goto } from '$app/navigation';
	import { categories } from '@src/collections';

	// console.log('categories', categories);

	function handleCreateNewCollection() {
		goto(`/builder/new`);
	}

	function handleCollectionClick(collectionName: string) {
		goto(`/builder/${collectionName}/edit`);
	}
</script>

<!-- Collection builder -->
<div class="align-centre mb-2 mt-2 flex dark:text-white">
	<div class="flex items-center justify-between">
		{#if $toggleLeftSidebar === true}
			<button type="button" on:keydown on:click={() => toggleLeftSidebar.update((value) => !value)} class="btn-icon variant-ghost-surface mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}
		<!-- Title  with icon -->
		<h1 class="{!$toggleLeftSidebar ? 'ml-2' : ''} h1 flex items-center gap-1">
			<iconify-icon icon="dashicons:welcome-widgets-menus" width="24" class="mr-1 text-error-500 sm:mr-2" /> Collection Builder
		</h1>
	</div>
</div>
<!-- List of .ts files -->
<div class="flex flex-col items-center justify-center">
	{#if !categories}
		<p class="my-2 text-center">Create a first collection to get started</p>
	{:else}
		<p class="my-2 text-center">Your Current Collections</p>
		<p class="my-2 text-center">Select to a Collection to Edit or create New Collection</p>

		<!-- Table of collection -->
		<table class="table-hover table border-2 border-primary-500">
			{#each categories as category}
				<tr class="border-b-2">
					<th>{category.name}</th>
				</tr>
				{#each category.collections as collection}
					<tr on:click={() => handleCollectionClick(collection.name)} class=" cursor-pointer hover:text-primary-500">
						<td>{collection.name}</td>
					</tr>
				{/each}
			{/each}
		</table>
	{/if}
	<button class="btn variant-filled-primary mt-4" on:click={handleCreateNewCollection}>Create New Collection</button>
</div>
