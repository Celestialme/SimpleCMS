<script lang="ts">
	import PageTitle from '@src/components/PageTitle.svelte';
	import TanstackTable from '@src/components/TanstackTable.svelte';

	// TanstackFilter
	import TanstackFilter from '@src/components/TanstackFilter.svelte';
	let searchValue = '';
	let searchShow = false;
	let filterShow = false;
	let columnShow = false;
	let density = 'normal';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	//Get message from +page.server.ts
	export let hasCollections;
	export let hasMediaFiles;
	export let hasPermission;
	export let errorMessage;
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

	// Table Data
	let data = [
		{
			_id: '9rK2Lr9pLJjS5CK',
			email: 'info@asset-trade.de',
			role: 'admin',
			username: 'Rar9',
			createdAt: 'createdAt',
			updatedAt: 'updatedAt',
			Image: 'image',
			Path: 'path'
		}
	];

	// Use the value of the data prop provided by +page.server.ts
	//export let data: any[];

	// Column Definition
	// let items = [
	//   { Header: 'Name', accessorKey: 'name', id: 'name' },
	//   { Header: 'Path', accessorKey: 'path', id: 'path' },
	// ];

	// Column Definition
	let items = [
		{ Header: 'ID', accessorKey: '_id', id: '_id' },
		{ Header: 'Username', accessorKey: 'username', id: 'username' },
		{ Header: 'Email', accessorKey: 'email', id: 'email' },
		{ Header: 'Role', accessorKey: 'role', id: 'role' },
		{ Header: 'Created At', accessorKey: 'createdAt', id: 'createdAt' },
		{ Header: 'Updated At', accessorKey: 'updatedAt', id: 'updatedAt' },
		{ Header: 'Image', accessorKey: 'image', id: 'image' },
		{ Header: 'Path', accessorKey: 'path', id: 'path' }
	];
</script>

<div class="flex flex-col gap-1">
	<PageTitle name="Media Gallery2" icon="bi:images" iconColor="text-primary-500" />

	<div class="flex items-center justify-between">
		<TanstackFilter bind:searchValue bind:searchShow bind:filterShow bind:columnShow bind:density />

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
							<p class="text-xs text-center">Display</p>
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
							<p class="text-xs text-center">Display</p>
							<iconify-icon
								icon="material-symbols:list-alt-outline"
								height="44"
								style={`color: white`}
							/>

							<!-- TODO: Center mobile labels -->
							{#if view === 'table'}
								<p class="text-xs text-center">Grid</p>
							{:else}
								<p class="text-xs text-center">Table</p>
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
							<iconify-icon icon="material-symbols:grid-view" height="40" style={`color: white`} />
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
						<iconify-icon icon="material-symbols:grid-view" height="40" style={`color: white`} /><br
						/>Large
					</button>
				{/if}
			</div>
		</div>
	</div>

	{#if !errorMessage}
		<!-- Grid display -->
		{#if view == 'grid'}
			<div class="mx-auto flex flex-wrap gap-2">
				Grid here<!-- {#each data as image}
					<div
						class={`card ${
							gridSize === 'small'
								? 'card-small'
								: gridSize === 'medium'
								? 'card-medium'
								: 'card-large'
						}`}
					>
						
						<section class="p-4 text-center">
							{#if image.image.endsWith('.pdf')}
								<iconify-icon
									icon="vscode-icons:file-type-pdf2"
									width={gridSize === 'small' ? '58' : gridSize === 'medium' ? '138' : '315'}
								/>
							{:else if image.image.endsWith('.xlsx') || image.image.endsWith('.xls')}
								<iconify-icon
									icon="vscode-icons:file-type-excel"
									width={gridSize === 'small' ? '58' : gridSize === 'medium' ? '138' : '315'}
								/>
							{:else if image.image.endsWith('.docx') || image.image.endsWith('.doc')}
								<iconify-icon
									icon="vscode-icons:file-type-word"
									width={gridSize === 'small' ? '58' : gridSize === 'medium' ? '138' : '315'}
								/>
							{:else if image.image.endsWith('.jpg') || image.image.endsWith('.jpeg') || image.image.endsWith('.png') || image.image.endsWith('.svg') || image.image.endsWith('.webp') || image.image.endsWith('.avif')}
								<img
									class={`inline-block object-cover object-center ${
										gridSize === 'small'
											? 'h-16 w-16'
											: gridSize === 'medium'
											? 'h-36 w-36'
											: 'h-80 w-80'
									}`}
									src={image.image}
									alt={image.name}
								/>
							{:else}
								<iconify-icon
									icon="noto-v1:question-mark"
									width={gridSize === 'small' ? '58' : gridSize === 'medium' ? '138' : '315'}
								/>
							{/if}
						</section>
						<footer
							class={`card-footer mt-1 flex h-14 w-full items-center justify-center break-all rounded-sm bg-surface-600 p-0 text-center text-xs text-white`}
							style={`max-width: ${
								gridSize === 'small' ? '6rem' : gridSize === 'medium' ? '12rem' : '24rem'
							}`}
						>
							<div class="flex-col">
								<div class="mb-1 line-clamp-2 font-semibold text-primary-500">{image.name}</div>
								<div class="line-clamp-1">{image.path}</div>
							</div>
						</footer>
					</div>
				{/each} -->
			</div>
		{:else}
			<TanstackTable
				{data}
				{items}
				tableData={data}
				dataSourceName="AdminArea"
				bind:searchValue
				bind:filterShow
				bind:columnShow
				bind:density
			/>
		{/if}
	{:else}
		<!-- Render error message -->
		<p class="h2 text-center text-error-500">errorMessage not showing: {errorMessage}</p>
	{/if}
</div>
