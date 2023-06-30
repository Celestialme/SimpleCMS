<script>
	import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
	import { contentLanguage } from '@src/stores/store';

	//console.log('contentLanguage', contentLanguage);

	// Manually parse the object from JSON string
	let options = JSON.parse(PUBLIC_CONTENT_LANGUAGES.replace(/'/g, '"'));

	function handleChange(event) {
		const selectedLanguage = event.target.value.toLowerCase();
		contentLanguage.set(selectedLanguage);
	}

	// Define reactive variables to track the state of each element
	export let searchShow = false;
	export let searchValue = '';
	export let filterShow = false;
	export let columnShow = false;
	export let density = 'normal';
	export let updateDensity;

	// Define a function to close any open elements
	function closeOpenStates() {
		searchShow = false;
		filterShow = false;
		columnShow = false;
	}
</script>

<!-- Expanding Search -->
{#if searchShow}
	<div class="btn-group variant-ghost-surface absolute left-1/2 top-0 flex -translate-x-1/2 transform items-center justify-end">
		<button
			type="button"
			on:click={() => {
				closeOpenStates();
				searchShow = !searchShow;
			}}
			class="w-12 border-r border-surface-500"
		>
			<iconify-icon
				icon="ic:outline-search-off"
				width="24"
				tabindex="0"
				role="button"
				on:click={() => {
					closeOpenStates();
				}}
				on:keydown={(event) => {
					if (event.key === 'Enter' || event.key === ' ') {
						closeOpenStates();
					}
				}}
			/>
		</button>
		<!-- TODO: Improve input put css to match btn-group -->
		<input
			type="text"
			placeholder="Search..."
			class="varient-ghost-surface input h-12 w-64 outline-none transition-all duration-500 ease-in-out"
			bind:value={searchValue}
			on:blur={() => (searchShow = false)}
			on:keydown={(e) => e.key === 'Enter' && (searchShow = false)}
		/>
	</div>
{:else}
	<button
		type="button"
		on:click={() => {
			closeOpenStates();
			searchShow = !searchShow;
		}}
		class="btn-icon variant-ghost-surface"
	>
		<iconify-icon icon="material-symbols:search-rounded" width="24" />
	</button>
{/if}

{#if !searchShow}
	<!-- Filter -->
	<button
		type="button"
		on:click={() => {
			closeOpenStates();
			filterShow = !filterShow;
		}}
		class="btn-icon variant-ghost-surface"
	>
		<iconify-icon icon="carbon:filter-edit" width="24" />
	</button>

	<!-- Column Order & Visibility -->
	<!-- Column Order/ Sort-->
	<button
		type="button"
		on:click={() => {
			closeOpenStates();
			columnShow = !columnShow;
		}}
		class="btn-icon variant-ghost-surface"
	>
		<iconify-icon icon="fluent:column-triple-edit-24-regular" width="24" />
		<!-- {$LL.TANSTACK_Column()} -->
	</button>

	<!-- Spacing/Density  -->
	<button
		type="button"
		on:click={() => {
			closeOpenStates();
			// Update the density variable
			if (density === 'compact') {
				updateDensity('normal');
			} else if (density === 'normal') {
				updateDensity('comfortable');
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
		/>
	</button>

	<!-- TODO: Show translation Status -->
	<!-- Mobile -->
	<select
		class="variant-ghost-surface rounded border-surface-500 text-white md:hidden"
		bind:value={$contentLanguage}
		on:change={handleChange}
		on:focus={() => {
			closeOpenStates();
		}}
	>
		{#each Object.keys(options) as value}
			<option {value}>{value.toUpperCase()}</option>
		{/each}
	</select>
	<!-- Desktop -->
	<select
		class="variant-ghost-surface hidden rounded border-surface-500 text-white md:block"
		bind:value={$contentLanguage}
		on:change={handleChange}
		on:focus={() => {
			closeOpenStates();
		}}
	>
		{#each Object.entries(options) as [value, label]}
			<option {value}>{label}</option>
		{/each}
	</select>
{/if}
