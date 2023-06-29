<script lang="ts">
	import { collection } from '@src/collections';
	import {
		collectionValue,
		mode,
		deleteEntry,
		switchSideBar,
		toggleLeftSidebar,
		toggleRightSidebar,
		toggleHeaderSidebar,
		toggleFooterSidebar
	} from '@src/stores/store';

	import { saveFormData } from '@src/utils/utils';

	async function saveData() {
		await saveFormData({ data: $collectionValue });

		// a function to undo the changes made by handleButtonClick
		mode.set('view' || 'edit');

		// get the current window width
		let width = window.innerWidth;

		// use the custom screens
		if (width <= 567) {
			// For mobile toggle Header/Footer Sidebars
			toggleLeftSidebar.set(true);
			switchSideBar.set(false);
			toggleHeaderSidebar.set(false);
			toggleFooterSidebar.set(false);
			toggleRightSidebar.set(true);
		} else if (width >= 568 && width <= 767) {
			// use switchSideBar for md
			toggleLeftSidebar.set(false);
			switchSideBar.set(false);
			toggleHeaderSidebar.set(false);
			toggleFooterSidebar.set(false);
			toggleRightSidebar.set(true);
		} else if (width > 768) {
			// use toggleRightSidebar for xl and above
			toggleLeftSidebar.set(false);
			switchSideBar.set(true);
			toggleHeaderSidebar.set(false);
			toggleFooterSidebar.set(false);
			toggleRightSidebar.set(true);
		}
	}
</script>

<!-- Desktop Right Sidebar -->
{#if $mode == 'view'}
	<button type="button" on:click={() => mode.set('create')} class=" btn variant-filled-primary mt-2">
		<iconify-icon icon="mdi:pen" width="24" />Create
	</button>
{:else if ['edit', 'create'].includes($mode)}
	<div class="mx-2 mt-2 flex h-full flex-col justify-between">
		<header class=" text-error-500">
			<button type="button" on:click={saveData} class="btn variant-filled-primary w-full gap-2">
				<iconify-icon icon="material-symbols:save" width="24" />
				Save {$collection.name}
			</button>
			{#if $mode == 'edit'}
				<button type="button" on:click={$deleteEntry} class="btn variant-filled-error mt-2 w-full">
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
			<h2 class="text-center font-bold">{$collection.name} Info:</h2>
			<div class="footer-content text-sm">
				<!-- TODO: Use real dates & revision -->
				<div class="mt-2 grid grid-cols-2 items-center gap-x-2 space-y-1 text-xs">
					<div>Created:</div>
					<div>{$collection.created}</div>
					<div>Updated:</div>
					<div>{$collection.updated}</div>
					<div>Revisions:</div>
					<div>{$collection.revision}</div>
				</div>
			</div>
		</footer>
	</div>
{:else if $mode == 'delete'}
	<button type="button" on:click={$deleteEntry} class="btn variant-filled-success">
		<iconify-icon icon="icomoon-free:bin" width="24" />Delete
	</button>
{/if}
