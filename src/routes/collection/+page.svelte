<script>
	import { dndzone } from 'svelte-dnd-action';
	import { flip } from 'svelte/animate';
	import { categories as importedCategories } from '@src/collections/index';
	import { toggleLeftSidebar } from '@src/stores/store';
	const flipDurationMs = 200;
	let newCategoryName = '';
	let categories = [...importedCategories];
	let collections = categories.flatMap((category) => category.collections);
	let availableCollections = collections.filter((collection) => {
		return !categories.some((category) => category.collections.includes(collection));
	});

	function addCategory() {
		categories.push({
			id: newCategoryName.toLowerCase().replace(/\s/g, '-'),
			name: newCategoryName,
			icon: '',
			collections: []
		});
		newCategoryName = '';
	}

	function handleDndConsider(e) {
		const categoryIndex = categories.findIndex((category) => category.id === e.detail.id);
		if (categoryIndex !== -1) {
			const existingCollections = categories[categoryIndex].collections;
			const draggedCollections = e.detail.items;
			const newCollections = draggedCollections.filter((collection) => {
				const collectionExists = existingCollections.some(
					(existingCollection) => existingCollection.id === collection.id
				);
				return !collectionExists;
			});
			categories[categoryIndex].collections = [...existingCollections, ...newCollections];
		}
		// Update availableCollections to remove items that have been dragged to a category
		availableCollections = availableCollections.filter((collection) => {
			return !categories.some((category) => category.collections.includes(collection));
		});
	}

	function handleDndFinalize(e) {
		// Do nothing, we already updated the collections in the on:consider handler
	}
</script>

<div class="flex items-center">
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
	<h1 class="h1 ml-2 flex items-center gap-1">Menu Builder</h1>
</div>

<!-- display collections -->
<div class="mt-2 rounded border p-2">
	<h2 class="mt-4 text-lg font-bold">Available Collections</h2>
	<div
		class="flex flex-wrap"
		use:dndzone={{
			items: availableCollections,
			type: 'copy'
		}}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
	>
		{#each availableCollections as collection}
			<div class="m-2 rounded border bg-gray-200 p-2 dark:text-black">{collection.name}</div>
		{/each}
	</div>
</div>

<!-- display categories -->
<h2 class="mb-2 mt-4 text-lg font-bold text-primary-500">Categories with Collections</h2>
<div class=" flex flex-wrap gap-2">
	{#each categories as category}
		<div class="gap-1 rounded border">
			<h3 class="text-center font-bold">{category.name}</h3>
			<div
				use:dndzone={{
					items: category.collections,
					type: 'copy'
				}}
				on:consider={handleDndConsider}
				on:finalize={handleDndFinalize}
			>
				{#each category.collections as collection}
					<div class="m-2 rounded border bg-gray-200 p-2 dark:text-black">{collection.name}</div>
				{/each}
			</div>
		</div>
	{/each}
</div>
