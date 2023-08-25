<script lang="ts">
	import { writable } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { categories as importedCategories } from '@src/collections/index';
	import { dndzone } from 'svelte-dnd-action';
	import PageTitle from '@src/components/PageTitle.svelte';
	// import { get } from 'svelte/store';

	const categories = writable(importedCategories);

	let draggedCategory;

	const handleDndConsider = (event) => {
		draggedCategory = event.detail.items[event.detail.draggedElIndex];
	};

	function handleDndFinalize(event) {
		const newCategories = event.detail.items;

		categories.update((oldCategories) => {
			const oldCategoriesArray = oldCategories;

			// Find the index of the draggedCategory in the oldCategories array
			const oldIndex = oldCategoriesArray.findIndex((category) => category === draggedCategory);
			const newIndex = newCategories.findIndex((category) => category === draggedCategory);

			if (oldIndex === -1 || newIndex === -1) {
				return oldCategoriesArray; // No changes needed
			}

			// Create a copy of the oldCategories array
			const newCategoriesArray = [...oldCategoriesArray];

			// Perform the array manipulation using splice
			const [removed] = newCategoriesArray.splice(oldIndex, 1);
			newCategoriesArray.splice(newIndex, 0, removed);

			// Return the updated array
			return newCategoriesArray;
		});
	}

	function handleCreateNewCollection() {
		goto(`/builder/new`);
	}

	//TODO: Create Pop Module for adding a Category name
	function handleCreateNewCategory() {
		goto(`/builder/new`);
	}

	function handleCollectionClick(collectionName: string) {
		goto(`/builder/${collectionName}/edit`);
	}
</script>

<!-- Collection builder -->
<div class="align-centre mb-2 mt-2 flex dark:text-white">
	<PageTitle name="Collection Builder" icon="" />
</div>
<!-- List of .ts files -->
<div class="flex flex-col items-center justify-center">
	{#if !categories}
		<p class="my-2 text-center">Create a first collection to get started</p>
	{:else}
		<h2 class="my-2 text-center font-bold">Current Collection Overview</h2>
		<p class="my-2 text-center">
			Select to a Collection to Edit or Create a New Collection. <br />Change Order by Dragging.
		</p>

		<!-- Table of collection -->
		<table class="table table-hover border-2 border-primary-500">
			<tbody
				use:dndzone={{ items: $categories, flipDurationMs: 300 }}
				on:consider|preventDefault={handleDndConsider}
				on:finalize|preventDefault={handleDndFinalize}
			>
				{#each $categories as category}
					<tr class=" bg-tertiary-500">
						<th>{category.name}</th>
					</tr>
					{#if !category.collections.length}
						<tr>
							<td>No collections in this category</td>
						</tr>
					{:else}
						{#each category.collections as collection}
							<tr
								on:click={() => handleCollectionClick(collection.name)}
								class=" cursor-pointer hover:text-primary-500"
							>
								<td>{collection.name}</td>
							</tr>
						{/each}
					{/if}
				{/each}
			</tbody>
		</table>
	{/if}
</div>

<!-- buttons -->
<div class="flex items-center justify-between gap-2">
	<button class="variant-filled-tertiary btn mt-4" on:click={handleCreateNewCategory}
		>Create New Category</button
	>
	<button class="variant-filled-primary btn mt-4" on:click={handleCreateNewCollection}
		>Create New Collection</button
	>
</div>
