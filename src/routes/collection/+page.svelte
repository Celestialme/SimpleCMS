<script lang="ts">
	import { categories as importedCategories, default as collections } from '@src/collections/index';
	import { toggleLeftSidebar } from '@src/stores/store';
	import Unassigned from './Unassigned.svelte';
	import Board from './Board.svelte';
	import IconifyPicker from '@src/components/IconifyPicker.svelte';
	import { updateCategories } from '@src/collections/index';

	//skeleton
	import { modalStore, type ModalComponent, type ModalSettings } from '@skeletonlabs/skeleton';
	import ModalAddCategory from './ModalAddCategory.svelte';

	// Modal Trigger - Generate User Registration email Token
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

<div class="mb-2 flex items-center">
	<!-- hamburger -->
	{#if $toggleLeftSidebar === 'closed'}
		<button
			type="button"
			on:click={() => toggleLeftSidebar.click()}
			class="btn-icon variant-ghost-surface"
		>
			<iconify-icon icon="mingcute:menu-fill" width="24" />
		</button>
	{/if}

	<div class="flex w-full justify-between">
		<!-- Title  with icon -->
		<h1 class="h1 ml-2 flex items-center gap-1">Menu Builder</h1>
		<button type="button" on:click={handleSaveClick} class="btn variant-filled-primary gap-2">
			<iconify-icon icon="material-symbols:save" width="24" class="text-white" />
			Save
		</button>
	</div>
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
