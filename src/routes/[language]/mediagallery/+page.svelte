<script lang="ts">
	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';
	import { toggleLeftSidebar } from '@src/stores/store';

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
	function storeUserPreference(view: 'grid' | 'table', gridSize: 'small' | 'medium' | 'large', tableSize: 'small' | 'medium' | 'large') {
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

	// Refresh tanstack
	$: if (tableSize) {
		refreshData();
	}

	import { writable } from 'svelte/store';
	import { flip } from 'svelte/animate';

	// tanstack table

	import { createSvelteTable, flexRender, getCoreRowModel, getSortedRowModel, getPaginationRowModel } from '@tanstack/svelte-table';

	import type { ColumnDef, TableOptions, SortDirection, FilterFn } from '@tanstack/svelte-table';

	type Images = {
		image: string;
		name: string;
		path: string;
	};

	// columns definition
	const defaultColumns: ColumnDef<Images>[] = [
		{
			accessorKey: 'image',
			header: () => 'Image',
			footer: (info) => info.column.id,
			cell: (info) =>
				flexRender(Avatar, {
					src: info.row.original.image,
					width: `${tableSize === 'small' ? 'w-6' : tableSize === 'medium' ? 'w-10' : 'w-14'}`
				})
		},
		{
			accessorKey: 'name',
			header: () => 'Name',
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		},
		{
			accessorKey: 'path',
			header: () => 'Path',
			cell: (info) => info.getValue(),
			footer: (info) => info.column.id
		}
	];

	// export let data;
	// console.log(data);
	// TODO: Grab mediaGallery data
	// // Allow pdf and doc image previews

	const defaultData: Images[] = [
		{
			image: '/Default_User.svg',
			name: 'Default_User',
			path: '/static/Default_User'
		},
		{
			image: '/SimpleCMS_Logo_Round.png',
			name: 'SimpleCMS_Logo_Round',
			path: '/static/SimpleCMS_Logo_Round'
		},
		{
			image: '/SimpleCMS_Logo.svg',
			name: 'SimpleCMS_Logo',
			path: '/static/SimpleCMS_Logo'
		},
		{
			image: '/SimpleCMS_Logo_Round.png',
			name: 'SimpleCMS_Logo_Round',
			path: '/static/SimpleCMS_Logo_Round'
		},
		{
			image: '/Default_User.svg',
			name: 'Default_User',
			path: '/static/Default_User'
		},
		{
			image: '/SimpleCMS_Logo_Round.png',
			name: 'SimpleCMS_Logo_Round',
			path: '/static/SimpleCMS_Logo_Round'
		},
		{
			image: '/SimpleCMS_Logo.svg',
			name: 'SimpleCMS_Logo',
			path: '/static/SimpleCMS_Logo'
		},
		{
			image: '/SimpleCMS_Logo_Round.png',
			name: 'SimpleCMS_Logo_Round',
			path: '/static/SimpleCMS_Logo_Round'
		}
	];

	let columnOrder: never[] = [];
	let columnVisibility = {};
	let sorting: any = [];

	const setColumnOrder = (updater: any) => {
		if (updater instanceof Function) {
			columnOrder = updater(columnOrder);
		} else {
			columnOrder = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				columnOrder
			}
		}));
	};

	const setColumnVisibility = (updater: any) => {
		if (updater instanceof Function) {
			columnVisibility = updater(columnVisibility);
		} else {
			columnVisibility = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				columnVisibility
			}
		}));
	};

	const setSorting = (updater: (arg0: any) => any) => {
		if (updater instanceof Function) {
			sorting = updater(sorting);
		} else {
			sorting = updater;
		}
		options.update((old) => ({
			...old,
			state: {
				...old.state,
				sorting
			}
		}));
	};

	const options = writable<TableOptions<Images>>({
		data: defaultData,
		columns: defaultColumns,
		state: {
			columnOrder,
			sorting
		},
		onColumnOrderChange: setColumnOrder,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnVisibilityChange: setColumnVisibility
	});

	const refreshData = () => {
		//console.info('refresh');
		options.update((prev) => ({
			...prev,
			data: defaultData
		}));
	};

	const rerender = () => {
		options.update((options) => ({
			...options,
			data: defaultData
		}));
	};

	var table = createSvelteTable(options);

	//svelte-dnd-action
	import { dndzone } from 'svelte-dnd-action';
	import { Button } from 'svelte-email';
	const flipDurationMs = 300;

	// Update items array to be an array of column objects
	let items = $table.getAllLeafColumns().map((column, index) => ({
		id: column.id,
		name: column.id,
		isVisible: column.getIsVisible() // Set initial visibility state based on column visibility
	}));

	function handleDndConsider(e: { detail: { items: { id: string; name: string; isVisible: boolean }[] } }) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: { detail: { items: { id: string; name: string; isVisible: boolean }[] } }) {
		items = e.detail.items;

		// Update column Order based on new order
		const newOrder = {};
		items.forEach((item) => {
			newOrder[item.id] = item.isVisible;
		});

		// const randomizeColumns = () => {
		// 	$table.setColumnOrder((_updater) => $table.getAllLeafColumns().map((d) => d.id));
		// };

		items = items.map((item) => {
			return {
				...item,
				getToggleVisibilityHandler() {
					return () => {
						const newOrder = { ...$table.setColumnOrder() };
						newOrder[item.id] = !newOrder[item.id];
						$table.setColumnOrder(newOrder);
					};
				}
			};
		});
		$table.setColumnOrder(newOrder);

		// console.log('table', $table.setColumnOrder);
		// console.log('columnOrder2', columnOrder);
		columnOrder = newOrder;
		rerender();
		table = createSvelteTable(options);
	}

	// Add toggle Order function to each column object
	items = items.map((item) => {
		return {
			...item,
			getToggleVisibilityHandler() {
				return () => {
					const newOrder = { ...$table.setColumnOrder() };
					newOrder[item.id] = !newOrder[item.id];
					$table.setColumnVisibility(newOrder);
				};
			}
		};
	});
	// console.log('columnOrder', columnOrder);
	// console.log('items', items);

	let columnShow = false;

	function searchGrid(searchValue) {
		// Get the data displayed in the grid
		let gridData = images;

		// Filter the data based on the search value
		let filteredData = gridData.filter((item) => {
			return item.name.toLowerCase().includes(searchValue.toLowerCase());
		});

		// Update the data displayed in the grid with the filtered data
		images = filteredData;
	}
</script>

<div class="m-2 flex flex-col gap-1">
	<div class="flex items-center">
		<!-- hamburger -->
		{#if $toggleLeftSidebar === true}
			<button type="button" on:keydown on:click={() => toggleLeftSidebar.update((value) => !value)} class="btn-icon variant-ghost-surface mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}
		<!-- Title  with icon -->
		<h1 class="h1 ml-2 flex items-center gap-1">
			<iconify-icon icon="bi:images" width="24" class="mr-1 text-red-500 sm:mr-2" /> Media Gallery
		</h1>
	</div>
	<!-- Header block -->
	<div class="mb-2 flex items-center justify-between border-b-2">
		{#if view === 'grid'}
			<!-- TODO: add actual search -->
			<!-- search input grid -->
			<div class="btn-group variant-filled-surface">
				<input type="text" class="input" placeholder="Search Grid..." />
				<button type="submit" class="btn-icon">
					<iconify-icon icon="material-symbols:search" width="24" />
				</button>
			</div>
		{:else}
			<!-- search input tanstack -->
			<div class="flex items-center gap-2">
				<div class="btn-group variant-filled-surface">
					<input type="text" class="input" placeholder="Search Table..." />
					<button type="submit" class="btn-icon">
						<iconify-icon icon="material-symbols:search" width="24" />
					</button>
				</div>

				<button type="submit" on:keydown on:click={() => (columnShow = !columnShow)} class="btn-icon variant-ghost-surface mr-1">
					<iconify-icon icon="gridicons:dropdown" width="24" />
				</button>
			</div>
		{/if}

		<!-- Mobile -->
		<div class="flex items-center justify-center text-center text-xs sm:hidden">
			<!-- Display Grid / Table -->
			<div class="flex flex-col items-center">
				Display
				<div class="flex sm:divide-x sm:divide-gray-500">
					{#if view === 'grid'}
						<div
							class="px-1"
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
							<iconify-icon icon="material-symbols:grid-view-rounded" height="40" style={`color: white`} />
							<br />Table
						</div>
					{:else}
						<div
							class="px-1"
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
							<iconify-icon icon="material-symbols:list-alt-outline" height="40" style={`color: white`} />
							<br />Grid
						</div>
					{/if}
				</div>
			</div>

			<!-- switch between small, medium, and large images -->
			<div class="flex flex-col items-center">
				Size
				<div class="flex divide-x divide-surface-500">
					{#if (view === 'grid' && gridSize === 'small') || (view === 'table' && tableSize === 'small')}
						<button type="button" class="px-1" on:click={handleClick}>
							<iconify-icon icon="material-symbols:background-grid-small-sharp" height="40" style={`color: white`} />
							<br />Small
						</button>
					{:else if (view === 'grid' && gridSize === 'medium') || (view === 'table' && tableSize === 'medium')}
						<button type="button" class="px-1" on:click={handleClick}>
							<iconify-icon icon="material-symbols:grid-on-sharp" height="40" style={`color: white`} />
							<br />Medium
						</button>
					{:else}
						<button type="button" class="px-1" on:click={handleClick}>
							<iconify-icon icon="material-symbols:grid-view" height="40" style={`color: white`} /><br />Large
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
				<div
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
					<iconify-icon icon="material-symbols:grid-view-rounded" height="40" style={`color: ${view === 'grid' ? 'white' : 'grey'}`} />
					<br />Grid
				</div>
				<div
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
					<iconify-icon icon="material-symbols:list-alt-outline" height="40" style={`color: ${view === 'table' ? 'white' : 'grey'}`} />
					<br />Table
				</div>
			</div>
		</div>

		<!-- switch between small, medium, and large images -->
		<div class="hidden flex-col items-center sm:flex">
			Size
			<div class="flex divide-x divide-gray-500">
				{#if (view === 'grid' && gridSize === 'small') || (view === 'table' && tableSize === 'small')}
					<button type="button" class="px-1 md:px-2" on:click={handleClick}>
						<iconify-icon icon="material-symbols:background-grid-small-sharp" height="40" style={`color: white`} />
						<br />Small
					</button>
				{:else if (view === 'grid' && gridSize === 'medium') || (view === 'table' && tableSize === 'medium')}
					<button type="button" class="px-1 md:px-2" on:click={handleClick}>
						<iconify-icon icon="material-symbols:grid-on-sharp" height="40" style={`color: white`} />
						<br />Medium
					</button>
				{:else}
					<button type="button" class="px-1 md:px-2" on:click={handleClick}>
						<iconify-icon icon="material-symbols:grid-view" height="40" style={`color: white`} /><br />Large
					</button>
				{/if}
			</div>
		</div>
	</div>

	{#if view === 'grid'}
		<!-- TODO: center box with cards mx-auto is not working -->
		<div class="mx-auto flex flex-wrap gap-2">
			{#each defaultData as image}
				<div class={`card ${gridSize === 'small' ? 'card-small' : gridSize === 'medium' ? 'card-medium' : 'card-large'}`}>
					<header class="card-header" />
					<section class="p-4 text-center">
						<img
							class={`inline-block object-cover object-center ${
								gridSize === 'small' ? 'h-16 w-16' : gridSize === 'medium' ? 'h-36 w-36' : 'h-80 w-80'
							}`}
							src={image.image}
							alt={image.name}
						/>
					</section>
					<footer
						class={`card-footer mt-1 flex h-9 w-full items-center justify-center break-all rounded-sm bg-surface-600 p-0 text-center text-xs text-white`}
						style={`max-width: ${gridSize === 'small' ? '6rem' : gridSize === 'medium' ? '12rem' : '24rem'}`}
					>
						{image.name}
					</footer>
				</div>
			{/each}
		</div>
	{:else}
		<div class="p-2">
			{#if columnShow}
				<!-- chip column order -->
				<div class="flex flex-col justify-center rounded-md bg-surface-700 text-center">
					<div class="font-semibold">Drag & Drop columns & Click to hide</div>
					<!-- toggle all -->
					<!-- TODO place into section row will kill dnd action-->
					<label class="mr-3">
						<input
							checked={$table.getIsAllColumnsVisible()}
							on:change={(e) => {
								console.info($table.getToggleAllColumnsVisibilityHandler()(e));
							}}
							type="checkbox"
						/>{' '}
						{$LL.TANSTACK_Toggle()}
					</label>
					<section
						class="flex justify-center rounded-md bg-surface-700 p-2"
						use:dndzone={{ items, flipDurationMs }}
						on:consider={handleDndConsider}
						on:finalize={handleDndFinalize}
					>
						{#each items as item (item.id)}
							<div
								class="chip {$table.getIsAllColumnsVisible()
									? 'variant-filled-secondary'
									: 'variant-ghost-secondary'} w-100 mr-2 flex items-center justify-center"
								animate:flip={{ duration: flipDurationMs }}
							>
								{#if $table.getIsAllColumnsVisible()}
									<span><iconify-icon icon="fa:check" /></span>
								{/if}
								<span class="ml-2 capitalize">{item.name}</span>
							</div>
						{/each}
					</section>
				</div>
				<div class="flex flex-col md:flex-row md:flex-wrap md:items-center md:justify-center">
					<!-- toggle all -->
					<div class="mb-2 flex items-center md:mb-0 md:mr-4">
						<label>
							<input
								checked={$table.getIsAllColumnsVisible()}
								on:change={(e) => {
									console.info($table.getToggleAllColumnsVisibilityHandler()(e));
								}}
								type="checkbox"
							/>{' '}
							{$LL.TANSTACK_Toggle()}
						</label>

						<!-- Show/hide Columns via chips -->
						<div class="flex flex-wrap items-center justify-center">
							{#each $table.getAllLeafColumns() as column}
								<span
									class="chip {column.getIsVisible() ? 'variant-filled-secondary' : 'variant-ghost-secondary'} mx-2 my-1"
									on:keydown
									on:click={column.getToggleVisibilityHandler()}
									on:keypress
								>
									{#if column.getIsVisible()}<span><iconify-icon icon="fa:check" /></span>{/if}
									<span class="capitalize">{column.id}</span>
								</span>
							{/each}
						</div>
					</div>
				</div>
			{/if}
			<div class="table-container">
				<table class="table-hover table">
					<thead>
						{#each $table.getHeaderGroups() as headerGroup}
							<tr class="divide-x divide-surface-400 border-b">
								{#each headerGroup.headers as header}
									<th colSpan={header.colSpan} class="text-center">
										{#if !header.isPlaceholder}
											<div
												class:cursor-pointer={header.column.getCanSort()}
												class:select-none={header.column.getCanSort()}
												on:keydown
												on:click={header.column.getToggleSortingHandler()}
											>
												<svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />
												{#if header.column.getIsSorted() === 'asc'}
													<iconify-icon icon="material-symbols:arrow-upward-rounded" width="16" />
												{:else if header.column.getIsSorted() === 'desc'}
													<iconify-icon icon="material-symbols:arrow-downward-rounded" width="16" />
												{/if}
											</div>
										{/if}
									</th>
								{/each}
							</tr>
						{/each}
					</thead>
					<tbody>
						{#each $table.getRowModel().rows.slice(0, 20) as row}
							<tr class="divide-x divide-surface-400">
								{#each row.getVisibleCells() as cell}
									<td>
										<svelte:component this={flexRender(cell.column.columnDef.cell, cell.getContext())} />
									</td>
								{/each}
							</tr>
						{/each}
					</tbody>
				</table>
			</div>
		</div>
	{/if}
</div>
