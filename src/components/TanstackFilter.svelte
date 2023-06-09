<script>
	export let searchShow = false;
	export let filterShow = false;
	export let columnShow = false;
	export let density = 'normal';
</script>

<!-- Expanding Search -->
{#if searchShow}
	<div class="variant-ghost-surface btn-group absolute -right-28 top-0 flex items-center justify-end">
		<button type="button" on:click={() => (searchShow = !searchShow)} class="w-12 border-r border-surface-500">
			<iconify-icon icon="ic:outline-search-off" width="24" />
		</button>
		<input
			type="text"
			placeholder="Search..."
			class="h-12 w-64 cursor-pointer rounded border-0 bg-gray-800 text-black outline-none transition-all duration-500 ease-in-out focus:border-blue-500 dark:text-white"
			on:blur={() => (searchShow = false)}
			on:keydown={(e) => e.key === 'Enter' && (searchShow = false)}
		/>
	</div>
{:else}
	<button type="button" on:click={() => (searchShow = !searchShow)} class="btn-icon variant-filled-surface">
		<iconify-icon icon="material-symbols:search-rounded" width="24" />
	</button>
{/if}

<!-- Filter -->
<button type="button" on:click={() => (filterShow = !filterShow)} class="btn-icon variant-filled-surface">
	<iconify-icon icon="material-symbols:filter-list-rounded" width="24" />
</button>

<!-- Column Order & Visility -->
<!-- Column Order/ Sort-->
<button type="button" on:click={() => (columnShow = !columnShow)} class="btn-icon variant-filled-surface">
	<iconify-icon icon="fluent:column-triple-edit-24-regular" width="24" />
	<!-- {$LL.TANSTACK_Column()} -->
</button>

<!-- Spacing/Density  -->
<button
	type="button"
	on:click={() => {
		// Update the density variable
		if (density === 'compact') {
			density = 'normal';
		} else if (density === 'normal') {
			density = 'relaxed';
		} else {
			density = 'compact';
		}

		//TODO: Refresh the table data not working
		//refresh($collection);
	}}
	class="btn-icon variant-filled-surface"
	><iconify-icon
		icon={density === 'compact'
			? 'material-symbols:align-space-even-rounded'
			: density === 'normal'
			? 'material-symbols:align-space-around-rounded'
			: 'material-symbols:align-space-between-rounded'}
		width="24"
	/><!-- {$LL.TANSTACK_Column()} -->
</button>
