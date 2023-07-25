<script lang="ts">
	import { writable } from 'svelte/store';

	export let density = 'normal';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	//svelte-dnd-action
	import { dndzone } from 'svelte-dnd-action';

	import {
		createSvelteTable,
		flexRender as flexRenderBugged,
		getCoreRowModel,
		getSortedRowModel,
		getPaginationRowModel // TODO: Update to better getPaginationRowModel
	} from '@tanstack/svelte-table';
	import type {
		ColumnDef,
		TableOptions,
		SortDirection,
		FilterFn
	} from '@tanstack/table-core/src/types';

	export let data: any[];
	export let items: any[];
	export let dataSourceName: string;

	// TanstackFilter export
	export let searchValue = '';
	export let filterShow = false;
	export let columnShow = false;

	let filterValues = {};
	let sorting: any = [];
	let columnOrder: any[] = [];
	let columnVisibility = {};

	// Update density and save to local storage
	// function updateDensity(newDensity) {
	// 	density = newDensity;
	// 	localStorage.setItem('density', newDensity);
	// }

	import FloatingInput from './system/inputs/floatingInput.svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import TanstackIcons from './TanstackIcons.svelte';

	import Loading from './Loading.svelte';
	import TanstackFilter from './TanstackFilter.svelte';
	export let isLoading = false;
	let loadingTimer: any; // recommended time of around 200-300ms

	export let tableData: any[];
	let filteredData = tableData;

	// Create a reactive statement that updates the filteredData array whenever the searchValue changes
	$: {
		if (searchValue) {
			filteredData = tableData.filter((row) => {
				// Check if any of the values in this row match the search value
				return Object.values(row).some((value) =>
					(value as string).toString().toLowerCase().includes(searchValue.toLowerCase())
				);
			});
		} else {
			filteredData = tableData;
		}
	}

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

	function setCurrentPage(page: number) {
		options.update((old: any) => {
			return {
				...old,
				state: {
					...old.state,
					pagination: {
						...old.state?.pagination,
						pageIndex: page
					}
				}
			};
		});
	}

	function setPageSize(e: Event) {
		const target = e.target as HTMLInputElement;
		options.update((old: any) => {
			return {
				...old,
				state: {
					...old.state,
					pagination: {
						...old.state?.pagination,
						pageSize: parseInt(target.value)
					}
				}
			};
		});
	}

	function handleCurrPageInput(e: Event) {
		const target = e.target as HTMLInputElement;
		setCurrentPage(parseInt(target.value) - 1);
	}

	const defaultColumns = JSON.parse(JSON.stringify(items));

	const storedValue = localStorage.getItem(`TanstackConfiguration-${dataSourceName}`);
	const columnsData = storedValue ? JSON.parse(storedValue) : defaultColumns;

	const options = writable<TableOptions<any>>({
		data: tableData,
		columns: columnsData.map((item: any) => {
			return defaultColumns.find((col: any) => col.accessorKey == item.accessorKey);
		}),

		state: {
			sorting,
			columnOrder
		},
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnOrderChange: setColumnOrder,
		ColumnVisibilityChange: setColumnVisibility
	});

	var table = createSvelteTable(options);

	$: {
		if (searchValue) {
			filteredData = tableData.filter((row) => {
				// Check if any of the values in this row match the search value
				return Object.values(row).some((value) =>
					(value as string).toString().toLowerCase().includes(searchValue.toLowerCase())
				);
			});
		} else {
			filteredData = tableData;
		}

		// Sort data based on current sorting state
		if (sorting.length > 0) {
			const sortColumn = sorting[0];
			filteredData.sort((a, b) => {
				const aValue = a[sortColumn.id];
				const bValue = b[sortColumn.id];
				if (aValue < bValue) {
					return sortColumn.desc ? 1 : -1;
				} else if (aValue > bValue) {
					return sortColumn.desc ? -1 : 1;
				} else {
					return 0;
				}
			});
		}
	}

	//workaround for svelte-table bug
	let flexRender = flexRenderBugged as (...args: Parameters<typeof flexRenderBugged>) => any;

	let SelectAll = false;
	let selectedMap = writable({});

	$: {
		if (SelectAll) {
			selectedMap.update((map) => {
				filteredData.forEach((row) => {
					map[row._id] = true;
				});
				return map;
			});
		} else {
			selectedMap.update((map) => {
				filteredData.forEach((row) => {
					map[row._id] = false;
				});
				return map;
			});
		}
	}
	$: {
		filteredData = tableData.filter((row) => {
			return Object.entries(filterValues).every(([key, value]) => {
				// Type guard to narrow down the type of the value
				if (typeof value === 'string') {
					return row[key].toString().toLowerCase().includes(value.toLowerCase());
				} else {
					return false;
				}
			});
		});
	}

	// dnd actions
	const flipDurationMs = 100;

	// Update items array to be an array of column objects
	//  let items = $table.getAllLeafColumns().map((column, index) => ({
	// 		id: column.id,
	// 		name: column.id,
	// 		isVisible: column.getIsVisible() // Set initial visibility state based on column visibility
	// 	}));

	// TODO: Don't update table on drag and drop, only on release for performance
	function handleDndConsider(e: {
		detail: { items: { id: string; name: string; isVisible: boolean }[] };
	}) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: {
		detail: { items: { id: string; name: string; isVisible: boolean }[] };
	}) {
		items = e.detail.items;

		// Update column Order based on new order
		const newOrder = {};
		items.forEach((item) => {
			newOrder[item.id] = item.isVisible;
		});

		items = items.map((item) => {
			return {
				...item,
				getToggleVisibilityHandler() {
					return () => {
						const newVisibility = { ...$table.getState().columnVisibility };
						newVisibility[item.id] = !newVisibility[item.id];
						$table.setColumnVisibility(newVisibility);
					};
				}
			};
		});

		$table.setColumnOrder(newOrder);

		var remappedColumns = items.map((item) => {
			return defaultColumns.find((col: any) => {
				return col.accessorKey == item.id;
			});
		});

		options.update((old) => {
			return {
				...old,
				columns: remappedColumns
			};
		});

		localStorage.setItem(
			`TanstackConfiguration-${dataSourceName}`,
			JSON.stringify(
				remappedColumns.map((item) => {
					return {
						...item,
						visible: getColumnByName(item.accessorKey)?.getIsVisible()
					};
				})
			)
		);

		table = createSvelteTable(options);
	}

	// Add toggle Order function to each column object
	items = items.map((item) => {
		return {
			...item,
			getToggleVisibilityHandler() {
				return () => {
					const newVisibility = { ...$table.getState().columnVisibility };
					newVisibility[item.id] = !newVisibility[item.id];
					$table.setColumnVisibility(newVisibility);
				};
			}
		};
	});

	function getColumnByName(name) {
		return $table.getAllLeafColumns().find((col) => {
			return col.id == name;
		});
	}
</script>

{#if isLoading}
	<Loading />
{:else}
	<!-- TanstackHeader -->
	{#if columnShow}
		<div
			class="rounded-b-0 flex flex-col justify-center rounded-t-md border-b bg-surface-300 text-center dark:bg-surface-700"
		>
			<div class="text-white dark:text-primary-500">Drag & Drop Columns / Click to hide</div>

			<!-- toggle all -->
			<div class="flex w-full items-center justify-center">
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

				<!-- Column Header -->
				<section
					class="flex flex-wrap justify-center gap-1 rounded-md p-2"
					use:dndzone={{ items, flipDurationMs }}
					on:consider={handleDndConsider}
					on:finalize={handleDndFinalize}
				>
					{#each items as item (item.id)}
						<button
							class="chip {$table
								.getAllLeafColumns()
								.find((col) => col.id == item.id)
								?.getIsVisible() ?? false
								? 'variant-filled-secondary'
								: 'variant-ghost-secondary'} w-100 mr-2 flex items-center justify-center"
							animate:flip={{ duration: flipDurationMs }}
							on:click={() => {
								getColumnByName(item.id)?.toggleVisibility();
								localStorage.setItem(
									`TanstackColumnVisibility-${dataSourceName}`,
									JSON.stringify(
										items.map((item) => {
											return {
												// Headers: item.Headers,
												accessorKey: item.id,
												visible: getColumnByName(item.id)?.getIsVisible()
											};
										})
									)
								);
							}}
						>
							{#if $table
								.getAllLeafColumns()
								.find((col) => col.id == item.id)
								?.getIsVisible() ?? false}
								<span><iconify-icon icon="fa:check" /></span>
							{/if}
							<span class="ml-2 capitalize">{item.Header}</span>
						</button>
					{/each}
				</section>
			</div>
		</div>
	{/if}

	<!-- Tanstack Table -->
	<div class="table-container">
		<table
			class="table table-hover {density === 'compact'
				? 'table-compact'
				: density === 'normal'
				? ''
				: 'table-comfortable'}"
		>
			<!-- Tanstack Header -->
			<thead class="text-primary-500">
				{#each $table.getHeaderGroups() as headerGroup}
					<tr class="divide-x border">
						<th class="border w-8">
							<TanstackIcons bind:checked={SelectAll} on:click={() => (SelectAll = !SelectAll)} />
						</th>
						{#each headerGroup.headers as header}
							<th>
								{#if !header.isPlaceholder}
									<button
										class:cursor-pointer={header.column.getCanSort()}
										class:select-none={header.column.getCanSort()}
										on:keydown
										on:click={header.column.getToggleSortingHandler()}
									>
										<svelte:component
											this={flexRender(header.column.columnDef.header, header.getContext())}
										/>
										{#if header.column.getIsSorted() === 'asc'}
											<iconify-icon icon="material-symbols:arrow-upward-rounded" width="16" />
										{:else if header.column.getIsSorted() === 'desc'}
											<iconify-icon icon="material-symbols:arrow-downward-rounded" width="16" />
										{/if}
									</button>

									{#if filterShow}
										<div transition:slide|global>
											<FloatingInput
												type="text"
												icon="material-symbols:search-rounded"
												label="Filter ..."
												on:input={(e) => {
													// Update filter value for this column
													header.column.setFilter(e.target.value);
												}}
											/>
										</div>
									{/if}
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</thead>

			<!-- Tanstack Body -->
			<tbody>
				{#each $table.getRowModel().rows as row, index}
					<tr>
						<!-- TickRows -->
						<td class="border">
							<TanstackIcons
								bind:checked={$selectedMap[row.id]}
								on:click={() => selectedMap.update((map) => ({ ...map, [row.id]: !map[row.id] }))}
								class="ml-1"
							/>
						</td>

						{#each row.getVisibleCells() as cell}
							<td class="border">
								{@html cell.getValue()}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>

			<!-- Tanstack Footer -->
			<!-- TODO: only use if footer if required -->
			<!-- <tfoot>
				{#each $table.getFooterGroups() as footerGroup}
					<tr>
						{#each footerGroup.headers as header}
							<th>
								{#if !header.isPlaceholder}
									<svelte:component
										this={flexRender(header.column.columnDef.footer, header.getContext())}
									/>
								{/if}
							</th>
						{/each}
					</tr>
				{/each}
			</tfoot> -->
		</table>

		<!-- Pagination Desktop -->
		<div class="my-3 flex items-center justify-around text-surface-500">
			<!-- show & count rows -->
			<div class="hidden text-sm text-surface-500 dark:text-surface-400 md:block">
				{$LL.TANSTACK_Page()}
				<span class="text-black dark:text-white">{$table.getState().pagination.pageIndex + 1}</span>
				{$LL.TANSTACK_of()}
				<!-- TODO: Get actual pages -->
				<!-- <span class="text-surface-700 dark:text-white">{$table.getState().pagination.pageCount}</span> -->
				<span class="text-black dark:text-white"
					>{Math.ceil(
						$table.getPrePaginationRowModel().rows.length / $table.getState().pagination.pageSize
					)}</span
				>
				- (<span class="text-black dark:text-white"
					>{$table.getPrePaginationRowModel().rows.length}</span
				>
				{$LL.TANSTACK_Total()}

				{#if $table.getPrePaginationRowModel().rows.length === 1}
					{$LL.TANSTACK_Row()}
				{:else}
					{$LL.TANSTACK_Rows()}
				{/if}
			</div>

			<!-- number of pages -->
			{#if $table.getPrePaginationRowModel().rows.length > 10}
				<!-- number of pages -->
				<select
					value={$table.getState().pagination.pageSize}
					on:change={setPageSize}
					class="select variant-ghost hidden max-w-[100px] rounded py-2 text-sm text-surface-500 dark:text-white sm:block"
				>
					{#each [10, 25, 50, 100, 500].filter((pageSize) => pageSize <= $table.getPrePaginationRowModel().rows.length) as pageSize}
						<option value={pageSize}>
							{pageSize} Rows
						</option>
					{/each}
				</select>
			{/if}

			<!-- next/previous pages -->
			<div
				class="btn-group variant-ghost inline-flex text-surface-500 transition duration-150 ease-in-out dark:text-white [&>*+*]:border-surface-500"
			>
				<button
					type="button"
					class="w-6"
					aria-label="Go to First Page"
					on:keydown
					on:click={() => setCurrentPage(0)}
					class:is-disabled={!$table.getCanPreviousPage()}
					disabled={!$table.getCanPreviousPage()}
				>
					<iconify-icon icon="material-symbols:first-page" width="24" />
				</button>

				<button
					type="button"
					class="w-6"
					aria-label="Go to Previous Page"
					on:keydown
					on:click={() => setCurrentPage($table.getState().pagination.pageIndex - 1)}
					class:is-disabled={!$table.getCanPreviousPage()}
					disabled={!$table.getCanPreviousPage()}
				>
					<iconify-icon icon="material-symbols:chevron-left" width="24" />
				</button>

				<!-- input display -->
				<div class="flex items-center justify-center px-2 text-sm">
					<span class="pr-2"> {$LL.TANSTACK_Page()} </span>

					<input
						type="number"
						value={$table.getState().pagination.pageIndex + 1}
						min={0}
						max={$table.getPageCount() - 1}
						on:change={handleCurrPageInput}
						class="variant-ghost-surface w-14 border-0"
					/>
					<span class="pl-2">
						{' '}{$LL.TANSTACK_of()}{' '}
						<span class="">{$table.getPageCount()}</span>
					</span>
				</div>

				<button
					type="button"
					class="w-6"
					aria-label="Go to Next Page"
					on:keydown
					on:click={() => setCurrentPage($table.getState().pagination.pageIndex + 1)}
					class:is-disabled={!$table.getCanNextPage()}
					disabled={!$table.getCanNextPage()}
				>
					<iconify-icon icon="material-symbols:chevron-right" width="24" />
				</button>

				<button
					type="button"
					class="w-6"
					aria-label="Go to Last Page"
					on:keydown
					on:click={() => setCurrentPage($table.getPageCount() - 1)}
					class:is-disabled={!$table.getCanNextPage()}
					disabled={!$table.getCanNextPage()}
				>
					<iconify-icon icon="material-symbols:last-page" width="24" />
				</button>
			</div>
		</div>

		<!-- Pagination Mobile-->
		<div class="flex flex-col items-center justify-center gap-2 md:hidden">
			{#if $table.getPrePaginationRowModel().rows.length > 10}
				<!-- number of pages -->
				<select
					value={$table.getState().pagination.pageSize}
					on:change={setPageSize}
					class="select max-w-[100px] text-sm sm:hidden"
				>
					{#each [10, 25, 50, 100, 500].filter((pageSize) => pageSize <= $table.getPrePaginationRowModel().rows.length) as pageSize}
						<option value={pageSize}>
							{pageSize}
							{$LL.TANSTACK_Rows()}
						</option>
					{/each}
				</select>
			{/if}

			<!-- Pagination -->
			<div class="text-sm text-gray-400">
				<span class="text-black dark:text-white">{$table.getState().pagination.pageIndex + 1}</span>
				{$LL.TANSTACK_of()}
				<!-- TODO: Get actual page -->
				<!-- <span class="text-surface-700 dark:text-white"
				>{$table.getState().pagination.pageIndex + 1}</span
			> -->
				<span class="text-black dark:text-white"
					>{Math.ceil(
						$table.getPrePaginationRowModel().rows.length / $table.getState().pagination.pageSize
					)}</span
				>
				- (<span class="text-black dark:text-white"
					>{$table.getPrePaginationRowModel().rows.length}</span
				>
				{$LL.TANSTACK_Total()}

				{#if $table.getPrePaginationRowModel().rows.length === 1}
					{$LL.TANSTACK_Row()})
				{:else}
					{$LL.TANSTACK_Rows()}){/if}
			</div>
		</div>
	</div>
{/if}

<style lang="postcss">
	.table tbody td {
		@apply !py-1.5;
	}

	.table-compact tbody td {
		@apply !py-0.5;
	}

	.table-comfortable tbody td {
		@apply !py-3.5;
	}
</style>
