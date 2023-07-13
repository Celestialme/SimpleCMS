<script lang="ts">
	import { categories as importedCategories } from '@src/collections/index';
	import { dndzone } from 'svelte-dnd-action';
	let newCategoryName = '';
	let categories = [...importedCategories];
	let collections = categories.flatMap((category) => category.collections);

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
			categories[categoryIndex].collections = e.detail.items;
		}
	}

	function handleDndFinalize(e) {
		const categoryIndex = categories.findIndex((category) => category.id === e.detail.id);
		if (categoryIndex !== -1) {
			categories[categoryIndex].collections = e.detail.items;
		}
	}
</script>

<input class="rounded border p-2" bind:value={newCategoryName} placeholder="New category name" />
<button class="rounded bg-blue-500 p-2 text-white" on:click={addCategory}> Add Category </button>

<!-- display collections -->
<div class="mt-2 rounded border p-2">
	<h2 class="mt-4 text-lg font-bold">Available Collections</h2>
	<div class="flex flex-wrap">
		{#each collections as collection}
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
					type: 'copy',
					id: category.id
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
