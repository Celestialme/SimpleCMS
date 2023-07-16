<script lang="ts">
	import { writable } from 'svelte/store';
	import { toggleLeftSidebar } from '@src/stores/store';
	import { goto } from '$app/navigation';
	import { categories as importedCategories } from '@src/collections/index';
	import { dndzone } from 'svelte-dnd-action';

	const categories = writable(importedCategories);

	let draggedCategory;

	const handleDndConsider = (event) => {
		draggedCategory = event.detail.items[event.detail.draggedElIndex];
	};

	const handleDndFinalize = (event) => {
		const newCategories = event.detail.items;
		categories.update((oldCategories) => {
			const oldIndex = oldCategories.findIndex((category) => category.id === draggedCategory.id);
			const newIndex = newCategories.findIndex((category) => category.id === draggedCategory.id);
			oldCategories.splice(oldIndex, 1);
			oldCategories.splice(newIndex, 0, draggedCategory);
			return oldCategories;
		});
	};

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
	<div class="flex items-center justify-between">
		<!-- hamburger -->
		{#if $toggleLeftSidebar === 'closed'}
			<button
				type="button"
				on:click={() => toggleLeftSidebar.click()}
				class="variant-ghost-surface btn-icon mt-1"
			>
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}

		<!-- Title  with icon -->
		<h1 class="{!$toggleLeftSidebar ? 'ml-2' : ''} h1 flex items-center gap-1">
			<iconify-icon
				icon="dashicons:welcome-widgets-menus"
				width="24"
				class="mr-1 text-error-500 sm:mr-2"
			/> Collection Builder
		</h1>
	</div>
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
	<button class="btn variant-filled-tertiary mt-4" on:click={handleCreateNewCategory}
		>Create New Category</button
	>
	<button class="btn variant-filled-primary mt-4" on:click={handleCreateNewCollection}
		>Create New Collection</button
	>
</div>
