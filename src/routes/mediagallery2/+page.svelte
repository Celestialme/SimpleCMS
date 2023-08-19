<script lang="ts">
	import PageTitle from '@src/components/PageTitle.svelte';
	import TanstackTable from '@src/components/TanstackTable.svelte';

	// TanstackFilter
	import TanstackFilter from '@src/components/TanstackFilter.svelte';
	let globalSearchValue = '';
	let searchShow = false;
	let filterShow = false;
	let columnShow = false;
	let density = 'normal';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	//Get message from +page.server.ts
	export let errorMessage = '';
	//console.log('error', errorMessage);

	//skeleton
	import { Avatar } from '@skeletonlabs/skeleton';

	// Define the view, gridSize, and tableSize variables with the appropriate types
	let view: 'grid' | 'table' = 'grid';
	let gridSize: 'small' | 'medium' | 'large' = 'small';
	let tableSize: 'small' | 'medium' | 'large' = 'small';

	// Get the user's preferred view, grid size, and table size from local storage or a cookie
	let userPreference = getUserPreferenceFromLocalStorageOrCookie();
	if (userPreference) {
		let [preferredView, preferredGridSize, preferredTableSize] = userPreference.split('/');
		view = preferredView as 'grid' | 'table';
		gridSize = preferredGridSize as 'small' | 'medium' | 'large';
		tableSize = preferredTableSize as 'small' | 'medium' | 'large';
	}

	// Define a function to store the user's preferred view, grid size, and table size
	function storeUserPreference(
		view: 'grid' | 'table',
		gridSize: 'small' | 'medium' | 'large',
		tableSize: 'small' | 'medium' | 'large'
	) {
		// Store the view, grid size, and table size for the current user in local storage or a cookie
		let userPreference = `${view}/${gridSize}/${tableSize}`;
		localStorage.setItem('GalleryUserPreference', userPreference);
	}

	function getUserPreferenceFromLocalStorageOrCookie(): string | null {
		return localStorage.getItem('GalleryUserPreference');
	}

	function handleClick() {
		// Update the size of the currently displayed view
		if (view === 'grid') {
			//Reset DND
			view;
			// Update the size of the grid view
			if (gridSize === 'small') {
				gridSize = 'medium';
			} else if (gridSize === 'medium') {
				gridSize = 'large';
			} else {
				gridSize = 'small';
			}
		} else {
			// Update the size of the table view
			if (tableSize === 'small') {
				tableSize = 'medium';
			} else if (tableSize === 'medium') {
				tableSize = 'large';
			} else {
				tableSize = 'small';
			}
		}

		// Store the new sizes for the current user
		let userPreference = `${view}/${gridSize}/${tableSize}`;
		localStorage.setItem('GalleryUserPreference', userPreference);
	}

	// dummy data for testing
	export let data: string[] = [];

	console.log('Data received in component:', data);

	// Column Definition
	let items = [
		{ Header: 'ID', accessorKey: '_id', id: '_id' },
		{ Header: 'Name', accessorKey: 'name', id: 'name' },
		{ Header: 'Email', accessorKey: 'email', id: 'email' },
		{ Header: 'Role', accessorKey: 'role', id: 'role' },
		{ Header: 'Created At', accessorKey: 'createdAt', id: 'createdAt' },
		{ Header: 'Updated At', accessorKey: 'updatedAt', id: 'updatedAt' },
		{ Header: 'Image', accessorKey: 'image', id: 'image' },
		{ Header: 'Path', accessorKey: 'path', id: 'path' }
	];

	// TODO: Fix Grid search
	// function searchGrid(searchValue) {
	// 	// Get the data displayed in the grid
	// 	let gridData = data;

	// 	// Filter the data based on the search value
	// 	let filteredData = gridData.filter((item) => {
	// 		// Check if the image name or path contains the search query
	// 		return (
	// 			item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
	// 			// item.path.toLowerCase().includes(searchValue.toLowerCase())
	// 		);
	// 	});

	// 	// Update the data displayed in the grid with the filtered data
	// 	data = filteredData;
	// }
</script>

<div class="flex flex-col gap-1">
	<PageTitle name="Media Gallery" icon="bi:images" iconColor="text-primary-500" />

	<div class="flex items-center justify-between">
		{#if view == 'grid'}
			<!-- TODO: add actual search -->
			<!-- search input grid -->
			<div class="variant-filled-surface btn-group">
				<input
					type="text"
					class="input"
					placeholder="Search Grid..."
					on:input={(event) => {
						if (event.target instanceof HTMLInputElement) {
							//console.log(event.target.value);
							// searchGrid(event.target.value);
						}
					}}
				/>
				<button type="submit" class="btn-icon">
					<iconify-icon icon="material-symbols:search" width="24" />
				</button>
			</div>
		{:else}
			<div>
				<!-- <TanstackFilter
					bind:searchValue={globalSearchValue}
					bind:searchShow
					bind:filterShow
					bind:columnShow
					bind:density
				/> -->
			</div>
		{/if}
		<div class="flex items-center justify-center gap-4">
			<!-- Header block -->
			<!-- Mobile -->
			<div class="flex items-center justify-center text-center text-xs sm:hidden">
				<!-- Display Grid / Table -->
				<div class="flex flex-col items-center justify-center">
					<div class="flex sm:divide-x sm:divide-gray-500">
						{#if view === 'grid'}
							<button
								class="btn flex flex-col items-center justify-center px-1"
								on:keydown
								on:click={() => {
									view = 'table';
									storeUserPreference(view, gridSize, tableSize);
								}}
								on:keydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										view = 'table';
										storeUserPreference(view, gridSize, tableSize);
									}
								}}
							>
								<p class="text-center text-xs">Display</p>
								<iconify-icon
									icon="material-symbols:grid-view-rounded"
									height="42"
									style={`color: white`}
								/>
								<p class="text-xs">Table</p>
							</button>
						{:else}
							<button
								class="btn flex flex-col items-center justify-center px-1"
								on:keydown
								on:click={() => {
									view = 'grid';
									storeUserPreference(view, gridSize, tableSize);
								}}
								on:keydown={(e) => {
									if (e.key === 'Enter' || e.key === ' ') {
										view = 'grid';
										storeUserPreference(view, gridSize, tableSize);
									}
								}}
							>
								<p class="text-center text-xs">Display</p>
								<iconify-icon
									icon="material-symbols:list-alt-outline"
									height="44"
									style={`color: white`}
								/>

								<!-- TODO: Center mobile labels -->
								{#if view === 'table'}
									<p class="text-center text-xs">Grid</p>
								{:else}
									<p class="text-center text-xs">Table</p>
								{/if}
							</button>
						{/if}
					</div>
				</div>

				<!-- switch between small, medium, and large images -->
				<div class="flex flex-col items-center">
					<p class="text-xs">Size</p>
					<div class="flex divide-x divide-surface-500">
						{#if (view === 'grid' && gridSize === 'small') || (view === 'table' && tableSize === 'small')}
							<button type="button" class="px-1" on:click={handleClick}>
								<iconify-icon
									icon="material-symbols:background-grid-small-sharp"
									height="40"
									style={`color: white`}
								/>
								<p class="text-xs">Small</p>
							</button>
						{:else if (view === 'grid' && gridSize === 'medium') || (view === 'table' && tableSize === 'medium')}
							<button type="button" class="px-1" on:click={handleClick}>
								<iconify-icon
									icon="material-symbols:grid-on-sharp"
									height="40"
									style={`color: white`}
								/>
								<p class="text-xs">Medium</p>
							</button>
						{:else}
							<button type="button" class="px-1" on:click={handleClick}>
								<iconify-icon
									icon="material-symbols:grid-view"
									height="40"
									style={`color: white`}
								/>
								<p class="text-xs">Large</p>
							</button>
						{/if}
					</div>
				</div>
			</div>
			<!-- Desktop -->
			<!-- Display Grid / Table -->
			<div class="hidden flex-col items-center sm:flex">
				Display
				<div class="flex divide-x divide-gray-500">
					<button
						class="px-2"
						on:keydown
						on:click={() => {
							view = 'grid';
							storeUserPreference(view, gridSize, tableSize);
						}}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								view = 'grid';
								storeUserPreference(view, gridSize, tableSize);
							}
						}}
					>
						<iconify-icon
							icon="material-symbols:grid-view-rounded"
							height="40"
							style={`color: ${view === 'grid' ? 'white' : 'grey'}`}
						/>
						<br />Grid
					</button>
					<button
						class="px-2"
						on:keydown
						on:click={() => {
							view = 'table';
							storeUserPreference(view, gridSize, tableSize);
						}}
						on:keydown={(e) => {
							if (e.key === 'Enter' || e.key === ' ') {
								view = 'table';
								storeUserPreference(view, gridSize, tableSize);
							}
						}}
					>
						<iconify-icon
							icon="material-symbols:list-alt-outline"
							height="40"
							style={`color: ${view === 'table' ? 'white' : 'grey'}`}
						/>
						<br />Table
					</button>
				</div>
			</div>

			<!-- switch between small, medium, and large images -->
			<div class="hidden flex-col items-center sm:flex">
				Size
				<div class="flex divide-x divide-gray-500">
					{#if (view === 'grid' && gridSize === 'small') || (view === 'table' && tableSize === 'small')}
						<button type="button" class="px-1 md:px-2" on:click={handleClick}>
							<iconify-icon
								icon="material-symbols:background-grid-small-sharp"
								height="40"
								style={`color: white`}
							/>
							<br />Small
						</button>
					{:else if (view === 'grid' && gridSize === 'medium') || (view === 'table' && tableSize === 'medium')}
						<button type="button" class="px-1 md:px-2" on:click={handleClick}>
							<iconify-icon
								icon="material-symbols:grid-on-sharp"
								height="40"
								style={`color: white`}
							/>
							<br />Medium
						</button>
					{:else}
						<button type="button" class="px-1 md:px-2" on:click={handleClick}>
							<iconify-icon
								icon="material-symbols:grid-view"
								height="40"
								style={`color: white`}
							/><br />Large
						</button>
					{/if}
				</div>
			</div>
		</div>
	</div>
	<!-- Render the error message if it exists -->
	{#if errorMessage}
		<p class="h2 text-center text-error-500">{errorMessage}</p>
	{:else}
		<!-- Grid display -->
		{#if view == 'grid'}
			GRID

			{data}

			{#each data as file, index}
				<!-- date here -->
			{/each}
		{:else}
			Table
			<!-- <TanstackTable
				{data}
				{items}
				tableData={data}
				dataSourceName="AdminArea"
				bind:globalSearchValue
				bind:filterShow
				bind:columnShow
				bind:density
			/> -->
		{/if}
	{/if}
</div>
