<script lang="ts">
	import { collection } from '@src/collections';
	import { collectionValue, mode, deleteEntry } from '@src/stores/store';
	import { saveFormData } from '@src/utils/utils';

	async function saveData() {
		await saveFormData({ data: $collectionValue });
		mode.set('view');
	}
</script>

<!-- Desktop Right Sidebar -->

{#if $mode == 'view'}
	<button type="button" on:click={() => mode.set('create')} class="btn variant-filled-primary">
		<iconify-icon icon="mdi:pen" width="24" />Create
	</button>
{:else if ['edit', 'create'].includes($mode)}
	<header class="mx-2 text-error-500">
		<button type="button" on:click={saveData} class="btn variant-filled-primary w-full">
			<iconify-icon icon="material-symbols:save" width="24" />Save {$collection.name}
		</button>
		<button type="button" on:click={$deleteEntry} class="variant-filled-error btn mt-2 w-full">
			<iconify-icon icon="icomoon-free:bin" width="24" />Delete {$collection.name}
		</button>
	</header>

	<main class="text-white">
		<h2 class="font-bold">Admin Widget Area:</h2>
		{#if collectionValue.name}<p>Seo {collectionValue.name} widget</p>{/if}
	</main>

	<footer class="text-white">
		<h2 class="text-center font-bold">Content Info:</h2>
		<div class="footer-content text-sm">
			<!-- TODO: Use real dates & revision -->
			{#if $collection.status}
				<div class="mb-2 text-error-500"><span>Status:</span><span class="uppercase">{$collection.status}</span></div>
			{/if}
			<div><span>Created:</span><span>{$collection.created}</span></div>
			<div><span>Updated:</span><span>{$collection.updated}</span></div>
			<div><span>Revisions:</span><span>{$collection.revision}</span></div>
		</div>
	</footer>
{:else if $mode == 'delete'}
	<button type="button" on:click={$deleteEntry} class="variant-filled-success btn">
		<iconify-icon icon="icomoon-free:bin" width="24" />Delete
	</button>
{/if}
