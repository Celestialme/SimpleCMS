<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import { createEventDispatcher } from 'svelte';
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
				class="relative my-1 flex h-10 w-full items-center justify-center rounded-sm border border-surface-700 bg-surface-300 text-center text-xs font-bold hover:bg-surface-400 dark:text-white"
				animate:flip={{ duration: flipDurationMs }}
			>
				{item.name}
				<iconify-icon
					icon="mdi:drag"
					width="18"
					class="absolute left-1 top-1/2 -translate-y-1/2 transform"
				/>
			</div>
		{/each}
	</div>
</div>
