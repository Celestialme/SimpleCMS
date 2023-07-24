<script lang="ts">
	import { writable } from 'svelte/store';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	//svelte-dnd-action
	import { dndzone } from 'svelte-dnd-action';

	import {
		createSvelteTable,
		flexRender as flexRenderBugged,
		getCoreRowModel,
		getSortedRowModel,
		getPaginationRowModel
	} from '@tanstack/svelte-table';
	import type {
		ColumnDef,
		TableOptions,
		SortDirection,
		FilterFn
	} from '@tanstack/table-core/src/types';

	export let data: any[];
	export let searchValue = '';
	export let columns: any[];

	console.log('columns', columns);

	let filterValues = {};

	$: {
		columns = columns.map((column) => ({
			...column,
			Filter: (rows, id) => {
				return rows.filter((row) => row.values[id].includes(filterValues[id]));
			}
		}));
	}

	let sorting: any = [];
	let columnOrder: any[] = [];
	let columnVisibility = {};

	import TanstackFilter from './TanstackFilter.svelte';

	let filterShow = false;
	let columnShow = false;

	// Retrieve density from local storage or set to 'normal' if it doesn't exist
	let density = localStorage.getItem('density') || 'normal';

	// Update density and save to local storage
	function updateDensity(newDensity) {
		density = newDensity;
		localStorage.setItem('density', newDensity);
	}

	import Loading from './Loading.svelte';
	import FloatingInput from './system/inputs/floatingInput.svelte';
	import { flip } from 'svelte/animate';
	import { slide } from 'svelte/transition';
	import TanstackIcons from './TanstackIcons.svelte';
	let isLoading = false;
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

	const options = writable<TableOptions<any>>({
		data: tableData,
		columns: columns.map((item) => {
			return columns.find((col) => col.accessorKey == item.accessorKey);
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

	//dnd action
	export let dataSourceName: string;
	const flipDurationMs = 100;

	columnOrder = columns.map((column) => column.id);

	// Update items array to be an array of column objects
	let items = columns.map((column) => ({
		id: column.id,
		name: column.Header,
		isVisible: getColumnByName(column.id)?.getIsVisible() ?? true
	}));

	//console.log('EntryList item', items);

	function handleDndConsider(e: {
		detail: { items: { id: string; name: string; isVisible: boolean }[] };
	}) {
		items = e.detail.items;
	}

	function handleDndFinalize(e: {
		detail: { items: { id: string; name: string; isVisible: boolean }[] };
	}) {
		// Update column order based on the results of the dnd action
		columnOrder = e.detail.items.map((item) => item.id);

		// Update column visibility based on the results of the dnd action
		const columnVisibility = {};
		for (const item of e.detail.items) {
			columnVisibility[item.id] = item.isVisible;
		}

		options.update((old) => ({
			...old,
			state: {
				...old.state,
				columnOrder,
				columnVisibility
			}
		}));

		localStorage.setItem(
			`TanstackConfiguration-${dataSourceName}`,
			JSON.stringify(
				columns.map((item) => {
					return {
						...item,
						visible: getColumnByName(item.accessorKey)?.getIsVisible()
					};
				})
			)
		);

		$table.setColumnOrder(columnOrder);
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

	// console.log('columnOrder', columnOrder);
	// console.log('items', items);

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
	<div class="relative py-2 hidden items-center justify-center gap-2 sm:flex">
		<TanstackFilter bind:searchValue bind:filterShow bind:columnShow bind:density {updateDensity} />
	</div>
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
					{#each columns as column (column.id)}
						<button
							class="chip {$table
								.getAllLeafColumns()
								.find((col) => col.id == column.id)
								?.getIsVisible() ?? false
								? 'variant-filled-secondary'
								: 'variant-ghost-secondary'} w-100 mr-2 flex items-center justify-center"
							animate:flip={{ duration: flipDurationMs }}
							on:click={() => {
								getColumnByName(column.id)?.toggleVisibility();
								localStorage.setItem(
									`TanstackColumnVisibility`,
									JSON.stringify(
										columns.map((column) => {
											return {
												accessorKey: column.id,
												visible: getColumnByName(column.id)?.getIsVisible()
											};
										})
									)
								);
							}}
						>
							{#if $table
								.getAllLeafColumns()
								.find((col) => col.id == column.id)
								?.getIsVisible() ?? false}
								<span><iconify-icon icon="fa:check" /></span>
							{/if}
							<span class="ml-2 capitalize">{column.Header}</span>
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
				<th class="border w-8">
					<TanstackIcons bind:checked={SelectAll} on:click={() => (SelectAll = !SelectAll)} />
				</th>

				{#each columns as column}
					<th
						class="border"
						on:click={() =>
							setSorting((oldSorting) => {
								const isDesc = oldSorting.find((d) => d.id === column.id)?.desc;
								return [{ id: column.id, desc: !isDesc }];
							})}
					>
						{column.Header}
						{#if sorting.find((d) => d.id === column.id)}
							{#if sorting.find((d) => d.id === column.id).desc}
								<iconify-icon icon="material-symbols:arrow-downward-rounded" width="16" />
							{:else}
								<iconify-icon icon="material-symbols:arrow-upward-rounded" width="16" />
							{/if}
						{/if}
						{#if filterShow}
							<div transition:slide|global>
								<FloatingInput
									type="text"
									icon="material-symbols:search-rounded"
									label="Filter ..."
									bind:value={filterValues[column.accessor]}
									on:click
								/>
							</div>
						{/if}
					</th>
				{/each}
			</thead>

			<!-- Tanstack Body -->
			<tbody>
				{#each filteredData as row}
					<tr>
						<!-- TickRows -->
						<td class="border">
							<TanstackIcons
								bind:checked={$selectedMap[row._id]}
								on:click={() => selectedMap.update((map) => ({ ...map, [row._id]: !map[row._id] }))}
								class="ml-1"
							/>
						</td>

						{#each columns as column}
							<td class="border">{row[column.accessor]}</td>
						{/each}
					</tr>
				{/each}
			</tbody>

			<!-- Tanstack Footer -->
			<tfoot>
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
			</tfoot>
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
					{$LL.TANSTACK_Row()})
				{:else}
					{$LL.TANSTACK_Rows()})
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
