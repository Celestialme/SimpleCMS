<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { createEventDispatcher } from 'svelte';
	import { goto } from '$app/navigation';
	const dispatch = createEventDispatcher();

	function handleColumnNameClick() {
		dispatch('columnnameclick', { name, icon });
	}

	const flipDurationMs = 200;
	export let name;
	export let items;
	export let icon;
	export let onDrop;

	function handleDndConsiderCards(e) {
		console.warn('got consider', name);
		items = e.detail.items;
	}

	function handleDndFinalizeCards(e) {
		onDrop(e.detail.items);
	}

	function handleCollectionClick(collectionName: string) {
		// Define the logic for handling the click on a collection
		// For example, you might want to navigate to the edit page for the selected collection
		goto(`/collection/${collectionName}/edit`);
	}
</script>

<div class="relative h-full w-full overflow-hidden">
	<!-- Column Categories -->
	<button
		on:click={handleColumnNameClick}
		aria-label="Edit column name and icon"
		class="flex h-10 items-center font-bold"
	>
		<iconify-icon {icon} width="18" />
		<span class="ml-2 dark:text-primary-500">{name}</span>
	</button>
	<iconify-icon icon="mdi:drag" width="18" class="absolute right-1 top-2" />
	<div
		class="-mr-2 h-[calc(100%-2.5em)] overflow-y-scroll"
		use:dndzone={{ items, flipDurationMs, zoneTabIndex: -1 }}
		on:consider={handleDndConsiderCards}
		on:finalize={handleDndFinalizeCards}
	>
		<!-- Column Collections -->
		{#each items as item (item.id)}
			<div
				class="my-1 flex h-10 w-full items-center justify-between rounded-sm border border-surface-700 bg-surface-300 py-2 text-center text-xs font-bold hover:bg-surface-400 dark:text-white"
				animate:flip={{ duration: flipDurationMs }}
			>
				<iconify-icon icon="mdi:drag" width="18" class=" pl-0.5" />

				<span class="break-word">{item.name}</span>

				<button class="text-black" on:click={() => handleCollectionClick(item.name)}
					><iconify-icon icon="mdi:pen" width="18" class="pr-0.5" /></button
				>
			</div>
		{/each}
	</div>
</div>
