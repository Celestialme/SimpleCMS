<script lang="ts">
	import { collection } from '@src/collections/index';
	import { collectionValue, mode, deleteEntry, handleSidebarToggle } from '@src/stores/store';
	//console.log('collection', collection);

	import { saveFormData } from '@src/utils/utils';
	import { user } from '@src/stores/store';

	async function saveData() {
		await saveFormData({ data: $collectionValue });

		// a function to undo the changes made by handleButtonClick
		mode.set('view' || 'edit');
		handleSidebarToggle();
	}

	const dates = { created: '', updated: '', revision: '' };

	async function getDates(collectionName) {
		// Get the model for the collection
		const Model = collection[collectionName];

		// Query the database for the desired data
		const result = await Model.findOne().sort({ createdAt: -1 }).exec();
		console.log('result', result);
		// Return the result
		return {
			created: result.createdAt,
			updated: result.updatedAt,
			revision: result.__v
		};
	}
</script>

{#if $collection.permissions?.[$user.role]?.write != false}
	<!-- Desktop Right Sidebar -->
	{#if $mode == 'view'}
		<button
			type="button"
			on:click={() => mode.set('create')}
			class=" btn variant-filled-primary mt-2"
		>
			<iconify-icon icon="mdi:pen" width="24" />Create
		</button>
	{:else if ['edit', 'create'].includes($mode)}
		<div class="mx-2 mt-2 flex h-full flex-col justify-between">
			<header class=" text-error-500">
				<button type="button" on:click={saveData} class="btn variant-filled-primary w-full gap-2">
					<iconify-icon icon="material-symbols:save" width="24" class="text-white" />
					Save {$collection.name}
				</button>

				{#if $mode == 'edit'}
					<button
						type="button"
						on:click={$deleteEntry}
						class="btn variant-filled-error mt-2 w-full"
					>
						<iconify-icon icon="icomoon-free:bin" width="24" />Delete {$collection.name}
					</button>
				{/if}
			</header>

			<!-- TODO: Only show it used -->
			<main class="mt-4 text-white">
				<h2 class="font-bold">Admin Widget Area:</h2>
				<p class="mt-2">Seo {$collection.name} widget</p>
			</main>

			<footer class="mb-2 text-white">
				<h2 class="text-center font-bold uppercase text-primary-500">{$collection.name} Info:</h2>
				<div class="footer-content text-sm">
					<!-- TODO: Use real dates & revision -->
					<div class="mt-2 grid grid-cols-2 items-center gap-x-2 space-y-1 text-xs">
						{#each Object.entries(dates) as [key, value]}
							{#if value}
								<div>{key}:</div>
								<div class="font-bold">{value}</div>
							{/if}
						{/each}
					</div>
				</div>
			</footer>
		</div>
	{:else if $mode == 'delete'}
		<button type="button" on:click={$deleteEntry} class="btn variant-filled-success">
			<iconify-icon icon="icomoon-free:bin" width="24" />Delete
		</button>
	{/if}
{/if}
