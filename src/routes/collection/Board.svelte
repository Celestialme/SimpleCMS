<script lang="ts">
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	import { createEventDispatcher } from 'svelte';
	import Column from './Column.svelte';
	const flipDurationMs = 300;

	export let columns: any;
	// will be called any time a card or a column gets dropped to update the parent data
	export let onFinalUpdate: any;

	function handleDndConsiderColumns(e) {
		columns = e.detail.items;
	}

	function handleDndFinalizeColumns(e) {
		onFinalUpdate(e.detail.items);
	}

	function handleItemFinalize(columnIdx, newItems) {
		columns[columnIdx].items = newItems;
		onFinalUpdate([...columns]);
	}

	const dispatch = createEventDispatcher();

	function handleColumnNameClick(column) {
		dispatch('columnnameclick', column);
	}
</script>

<section
	class="mt-2 flex h-[90vh] w-full"
	use:dndzone={{ items: columns, flipDurationMs, type: 'column' }}
	on:consider={handleDndConsiderColumns}
	on:finalize={handleDndFinalizeColumns}
>
	{#each columns as { id, name, icon, items }, idx (id)}
		<div
			class="float-left mx-1 w-1/4 rounded-sm border border-surface-300 p-1 dark:border-surface-400"
			animate:flip={{ duration: flipDurationMs }}
		>
			<Column {name} {icon} {items} onDrop={(newItems) => handleItemFinalize(idx, newItems)} />
		</div>
	{/each}
</section>
