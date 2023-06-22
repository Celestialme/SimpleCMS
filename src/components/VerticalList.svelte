<script>
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';
	export let items;
	const flipDurationMs = 300;
	function handleDndConsider(e) {
		items = e.detail.items;
	}
	function handleDndFinalize(e) {
		items = e.detail.items;
	}
</script>

<div>
	<!-- Header -->
	<div class="flex w-full items-center gap-4 bg-primary-500 p-1 py-2 pl-3 text-center font-semibold">
		<div class="text-black">ID:</div>
		<div class="text-black">Name:</div>
		<div class="text-black">DBName:</div>
		<div class="text-black">Widget:</div>
	</div>

	<section
		use:dndzone={{ items, flipDurationMs }}
		on:consider={handleDndConsider}
		on:finalize={handleDndFinalize}
		class="my-2 h-40 w-full overflow-scroll border border-surface-400 p-2"
	>
		<!-- Data -->
		{#each items as item (item.id)}
			<div
				animate:flip={{ duration: flipDurationMs }}
				class="border-blue variant-ghost-secondary my-2 flex w-full
			items-center gap-6 rounded-md border p-1 text-center text-primary-500"
			>
				<div class="marker: badge variant-outline-primary rounded-full text-white">{item.id}</div>
				<div class="text-white">{item.name}</div>
				<div class="text-white">{item.DBName}</div>
				<div class="text-white">{item.widget}</div>
			</div>
		{/each}
	</section>
</div>
