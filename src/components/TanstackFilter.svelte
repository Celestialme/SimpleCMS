<script>
	export let searchShow = false;
	export let searchValue = '';
	export let filterShow = false;
	export let columnShow = false;
	export let density = 'normal';
	export let updateDensity;
</script>

<!-- Expanding Search -->

{#if searchShow}
	<div class="btn-group variant-ghost-surface absolute left-1/2 top-0 flex -translate-x-1/2 transform items-center justify-end">
		<button type="button" on:click={() => (searchShow = !searchShow)} class="w-12 border-r border-surface-500">
			<iconify-icon icon="ic:outline-search-off" width="24" />
		</button>
		<input
			type="text"
			placeholder="Search..."
			class="varient-ghost-surface input !h-12 w-64 outline-none transition-all duration-500 ease-in-out"
			bind:value={searchValue}
			on:blur={() => (searchShow = false)}
			on:keydown={(e) => e.key === 'Enter' && (searchShow = false)}
		/>
	</div>
{:else}
	<button type="button" on:click={() => (searchShow = !searchShow)} class="btn-icon variant-ghost-surface">
		<iconify-icon icon="material-symbols:search-rounded" width="24" />
	</button>
{/if}

{#if !searchShow}
	<!-- Filter -->
	<button type="button" on:click={() => (filterShow = !filterShow)} class="btn-icon variant-ghost-surface">
		<iconify-icon icon="material-symbols:filter-list-rounded" width="24" />
	</button>

	<!-- Column Order & Visility -->
	<!-- Column Order/ Sort-->
	<button type="button" on:click={() => (columnShow = !columnShow)} class="btn-icon variant-ghost-surface">
		<iconify-icon icon="fluent:column-triple-edit-24-regular" width="24" />
		<!-- {$LL.TANSTACK_Column()} -->
	</button>

	<!-- Spacing/Density  -->
	<button
		type="button"
		on:click={() => {
			// Update the density variable
			if (density === 'compact') {
				updateDensity('normal');
			} else if (density === 'normal') {
				updateDensity('relaxed');
			} else {
				updateDensity('compact');
			}
		}}
		class="btn-icon variant-ghost-surface"
		><iconify-icon
			icon={density === 'compact'
				? 'material-symbols:align-space-even-rounded'
				: density === 'normal'
				? 'material-symbols:align-space-around-rounded'
				: 'material-symbols:align-space-between-rounded'}
			width="24"
		/><!-- {$LL.TANSTACK_Column()} -->
	</button>

	<select class="variant-ghost-surface rounded text-white">
		<option value="EN">EN</option>
	</select>
{/if}
