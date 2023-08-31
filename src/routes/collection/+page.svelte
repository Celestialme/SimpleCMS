<script lang="ts">
	import { categories, collection, unAssigned } from '@src/stores/store';
	import Unassigned from './Unassigned.svelte';
	import Board from './Board.svelte';

	//skeleton
	import { getModalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	const modalStore = getModalStore();
	import ModalAddCategory from './ModalAddCategory.svelte';
	import PageTitle from '@src/components/PageTitle.svelte';
	import { unknown } from 'zod';

	// Modal Trigger - New Category
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
					availableCollection = [
						...availableCollection,
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

	// Modal Trigger - New Collection
	//TODO: still needs work
	function modalAddCollection(): void {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: ModalAddCategory,

			// Provide default slot content as a template literal
			slot: '<p>Edit Form</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			title: 'Add New Collection',
			body: 'Enter Unique Name and an Icon for your new Collection',
			component: modalComponent
			// response: (r: any) => {
			// 	if (r) {
			// 		columnsData = [
			// 			...columnsData,
			// 			{
			// 				id: r.newCategoryName.toLowerCase().replace(/\s/g, '-'),
			// 				name: r.newCategoryName,
			// 				icon: r.newCategoryIcon,
			// 				items: []
			// 			}
			// 		];
			// 		console.log('response:', r);
			// 	}
			// }
		};
		modalStore.trigger(d);
	}

	// Define the structure of an unassigned collection
	let UnassingedCollections = $unAssigned.map((unAssigned, collectionIndex) => ({
		id: `${collectionIndex + 1}`,
		name: 'Unassigned',
		icon: 'Unassigned',
		items: $unAssigned.map((collection: any, collectionIndex: number) => ({
			id: `${collectionIndex + 1}`,
			name: collection.name
		}))
	}));

	// Define the structure of an Assigned collection
	let availableCollection = $categories.map((category, categoryIndex) => ({
		id: `${categoryIndex + 1}`,
		name: category.name,
		icon: category.icon,
		items: category.collections.map((collection: any, collectionIndex: number) => ({
			id: `${categoryIndex + 1}.${collectionIndex + 1}`,
			name: collection.name
		}))
	}));

	function handleUnassignedUpdated(newItems) {
		UnassingedCollections = newItems;
	}

	function handleBoardUpdated(newColumnsData) {
		availableCollection = newColumnsData;
	}

	async function handleSaveClick() {
		const response = await fetch('/api/update_categories', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(availableCollection)
		});

		if (response.ok) {
			console.log('Categories updated');
		} else {
			console.error('Error updating categories');
		}
	}
</script>

<div class="mb-2 flex items-center justify-between">
	<PageTitle name="Menu Builder" icon="" />

	<button
		type="button"
		on:click={handleSaveClick}
		class="variant-filled-primary btn gap-2 !text-white"
	>
		<iconify-icon icon="material-symbols:save" width="24" class="text-white" />
		Save
	</button>
</div>

<!-- add an input field and a button here -->
<div class="my-1 ml-1 flex flex-col justify-around gap-1 rounded-sm bg-surface-500 p-2 sm:flex-row">
	<button
		on:click={modalAddCategory}
		type="button"
		class="variant-filled-tertiary btn-sm rounded-md">Add Category</button
	>
	<!-- add new Collection-->
	<!-- TODO: only show  when Category exists -->
	<button
		on:click={modalAddCollection}
		type="button"
		class="variant-filled-success btn-sm rounded-md">Add Collection</button
	>
</div>
{#if !availableCollection}
	<p class="my-2 text-center">Create a first collection to get started</p>
{:else}
	<!-- display unassigned collections -->
	<Unassigned items={UnassingedCollections} onDrop={handleUnassignedUpdated} />

	<!-- display collections -->
	<Board columns={availableCollection} onFinalUpdate={handleBoardUpdated} />
{/if}
