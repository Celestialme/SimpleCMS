<script lang="ts">
	import { categories as importedCategories, default as collections } from '@src/collections/index';

	import Unassigned from './Unassigned.svelte';
	import Board from './Board.svelte';

	//skeleton
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import ModalAddCategory from './ModalAddCategory.svelte';
	import PageTitle from '@src/components/PageTitle.svelte';

	// Modal Trigger  - New Category
	function modalAddCategory(): void {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: ModalAddCategory,

			// Provide default slot content as a template literal
			slot: '<p>Edit Form</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			title: 'Add New Category',
			body: 'Enter Unique Name and an Icon for your new category column',
			component: modalComponent,
			response: (r: any) => {
				if (r) {
					columnsData = [
						...columnsData,
						{
							id: r.newCategoryName.toLowerCase().replace(/\s/g, '-'),
							name: r.newCategoryName,
							icon: r.newCategoryIcon,
							items: []
						}
					];
					console.log('response:', r);
				}
			}
		};
		modalStore.trigger(d);
	}

	// let availableCollections = unAssigned;
	// TODO: display Unassigned  collections only
	let availableCollections = collections.filter((collection) => {
		return !importedCategories.some((category) => category.collections.includes(collection));
	});

	let columnsData = [
		...importedCategories.map((category) => ({
			id: category.id,
			name: category.name,
			icon: category.icon,
			items: category.collections.map((collection) => ({
				id: collection.id,
				name: collection.name
			}))
		}))
	];

	function handleUnassignedUpdated(newItems) {
		//console.log('Updated unassigned items:', newItems); // <-- add this line
		availableCollections = newItems;
	}

	function handleBoardUpdated(newColumnsData) {
		// if you wanted to update a database or a server, this is where you would do it
		columnsData = newColumnsData;
	}

	async function handleSaveClick() {
		const response = await fetch('/api/update_categories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(columnsData)
		});

		if (response.ok) {
			console.log('Categories updated');
		} else {
			console.error('Error updating categories');
		}
	}
</script>

<div class="mb-2 flex items-center justify-between">
	<PageTitle name="Menu Builder" />

	<button
		type="button"
		on:click={handleSaveClick}
		class="btn variant-filled-primary gap-2 !text-white"
	>
		<iconify-icon icon="material-symbols:save" width="24" class="text-white" />
		Save
	</button>
</div>

<!-- add an input field and a button here -->
<div class="my-1 ml-1 flex-col rounded-sm bg-surface-500 p-2 text-center">
	<button
		on:click={modalAddCategory}
		type="button"
		class="btn-sm variant-filled-tertiary rounded-md">Add New Category</button
	>
</div>

<!-- display unassigned collections -->
<Unassigned items={availableCollections} onDrop={handleUnassignedUpdated} />

<!-- display collections -->
<Board columns={columnsData} onFinalUpdate={handleBoardUpdated} />
