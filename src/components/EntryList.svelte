<script lang="ts">
	import { categories } from '@src/collections';
	import { collection } from '@src/collections';
	import { mode, entryData, deleteEntry, toggleLeftSidebar, searchShow, filterShow, columnShow, density } from '@src/stores/store';
	import axios from 'axios';
	import { writable } from 'svelte/store';
	import DeleteIcon from './DeleteIcon.svelte';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	import TanstackFilter from './TanstackFilter.svelte';

	// function toggleInput() {
	// 	showInput.update((value) => !value);
	// }

	import {
		createSvelteTable,
		flexRender as flexRenderBugged,
		getCoreRowModel,
		getSortedRowModel,
		getPaginationRowModel
	} from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions, SortDirection, FilterFn } from '@tanstack/table-core/src/types';

	import FloatingInput from './system/inputs/floatingInput.svelte';
	import EntryListMultiButton from './EntryList_MultiButton.svelte';

	let data: { entryList: [any]; totalCount: number } | undefined;
	let tableData: any = [];
	let deleteMap: any = {};
	let deleteAll = false;
	let sorting: any = [];
	let columnOrder: never[] = [];
	let columnVisibility = {};
	let globalFilter = '';

	let mobileExpand = false;

	// This function refreshes the data displayed in a table by fetching new data from an API endpoint and updating the tableData and options variables.
	let refresh = async (collection: typeof $collection) => {
		data = undefined;
		data = (await axios.get(`/api/${$collection.name}?page=${1}&length=${50}`).then((data) => data.data)) as { entryList: [any]; totalCount: number };
		tableData = await Promise.all(
			data.entryList.map(async (entry) => {
				let obj: { [key: string]: any } = {};
				for (let field of collection.fields) {
					obj[field.label] = await field.display(entry[field.label]?.en || entry[field.label], field, entry);
				}
				obj._id = entry._id;
				return obj;
			})
		);
		options.update((options) => ({
			...options,
			data: tableData,
			columns: $collection.fields.map((field) => ({
				accessorKey: field.label
			}))
		}));
		deleteMap = {};
		deleteAll = false;
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

	const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
		// // Rank the item
		// const itemRank = rankItem(row.getValue(columnId), value);
		// // Store the itemRank info
		// addMeta({
		// 	itemRank
		// });
		// // Return if the item should be filtered in/out
		// return itemRank.passed;
	};

	const globalFilterFn: FilterFn<any> = (row, columnId, value, addMeta) => {
		// if (Array.isArray(value)) {
		// 	if (value.length === 0) return true;
		// 	return value.includes(row.getValue(columnId));
		// }
		// // Rank the item
		// const itemRank = rankItem(row.getValue(columnId), value);
		// // Store the itemRank info
		// addMeta({
		// 	itemRank
		// });
		// // Return if the item should be filtered in/out
		// return itemRank.passed;
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

	$: refresh($collection);
	$: process_deleteAll(deleteAll);
	$: Object.values(deleteMap).includes(true) ? mode.set('delete') : mode.set('view');

	const options = writable<TableOptions<any>>({
		data: tableData,
		columns: $collection.fields.map((field) => ({
			accessorKey: field.label
		})),
		filterFns: {
			fuzzy: fuzzyFilter
		},
		state: {
			sorting,
			columnOrder,
			globalFilter
		},

		onSortingChange: setSorting,
		globalFilterFn: globalFilterFn,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		onColumnOrderChange: setColumnOrder,
		ColumnVisibilityChange: setColumnVisibility
	});

	$: table = createSvelteTable(options);

	//workaround for svelte-table bug
	let flexRender = flexRenderBugged as (...args: Parameters<typeof flexRenderBugged>) => any;
	function process_deleteAll(deleteAll: boolean) {
		// triggerConfirm = true;
		if (deleteAll) {
			for (let item in tableData) {
				deleteMap[item] = true;
			}
		} else {
			for (let item in deleteMap) {
				deleteMap[item] = false;
			}
		}
	}

	$deleteEntry = async () => {
		let deleteList: Array<string> = [];
		for (let item in deleteMap) {
			//console.log(tableData[item]);
			deleteMap[item] && deleteList.push(tableData[item]._id);
		}
		if (deleteList.length == 0) return;
		let formData = new FormData();
		formData.append('ids', JSON.stringify(deleteList));
		await axios.delete(`/api/${$collection.name}`, { data: formData });
		refresh($collection);
		mode.set('view');
	};
</script>

<div class="m-2 flex justify-between dark:text-white">
	<!-- Row 1 for Mobile -->
	<div class="flex items-center justify-between">
		{#if $toggleLeftSidebar === true}
			<button type="button" on:click={() => toggleLeftSidebar.update((value) => !value)} class="btn-icon variant-ghost-surface mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}
		<!-- Collection type with icon -->
		<div class="mr-1 flex flex-col {!$toggleLeftSidebar ? 'ml-2' : 'ml-1'}">
			{#if categories}<div class="mb-2 text-xs capitalize text-surface-500 dark:text-surface-300">
					{categories[0].name}
				</div>{/if}
			<div class="-mt-2 flex justify-start text-sm font-bold uppercase dark:text-white md:text-2xl lg:text-xl">
				{#if $collection.icon}<span> <iconify-icon icon={$collection.icon} width="24" class="mr-1 text-red-500 sm:mr-2" /></span>{/if}
				{#if $collection.name}
					<div class="flex max-w-[65px] whitespace-normal leading-3 sm:mr-2 sm:max-w-none md:mt-0 md:leading-none xs:mt-1">
						{$collection.name}
					</div>
				{/if}
			</div>
		</div>
	</div>

	<button type="button" on:click={() => (mobileExpand = !mobileExpand)} class="btn-icon variant-ghost-surface sm:hidden">
		<iconify-icon icon="gridicons:dropdown" width="30" />
	</button>

	<div class="relative flex hidden items-center justify-center gap-2 sm:block">
		<TanstackFilter {$searchShow} {$filterShow} {$columnShow} {$density} />
	</div>

	<!-- MultiButton -->
	<EntryListMultiButton />
</div>

<!-- Row 2 for Mobile  / Center on desktop -->
<!-- TODO:add  expand transition -->
<div class="relative flex items-center justify-center gap-2 bg-surface-800 py-2 {!mobileExpand ? 'hidden' : 'block'}">
	<TanstackFilter {$searchShow} {$filterShow} {$columnShow} {$density} />
</div>

{#if $columnShow}
	<div class="flex flex-col dark:text-white md:flex-row md:flex-wrap md:items-center md:justify-center">
		<!-- toggle all -->
		<div class="mb-2 flex items-center md:mb-0 md:mr-4">
			<label>
				<input
					class="input"
					id="toggle-all"
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
						on:click={column.getToggleVisibilityHandler()}
						on:keypress
					>
						{#if column.getIsVisible()}
							<span><iconify-icon icon="fa:check" /></span>
						{/if}
						<span class="capitalize">{column.id}</span>
					</span>
				{/each}
			</div>
		</div>
	</div>
{/if}

<!-- Tanstack Table -->
<div class="table-container px-2">
	<table class="table-hover table {$density === 'compact' ? 'table-compact' : $density === 'normal' ? '' : 'table-comfortable'}">
		<thead class="!text-primary">
			{#each $table.getHeaderGroups() as headerGroup}
				<tr class="divide-x divide-surface-400 border-b">
					<th class="!w-6">
						<DeleteIcon bind:checked={deleteAll} />
					</th>

					{#each headerGroup.headers as header}
						<th class="">
							{#if !header.isPlaceholder}
								<div
									class:cursor-pointer={header.column.getCanSort()}
									class:select-none={header.column.getCanSort()}
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

				{#if $filterShow}
					<tr class="divide-x divide-surface-400 capitalize">
						{#each headerGroup.headers as header}
							<th>
								<!-- Add your filter input here -->
								<FloatingInput
									type="text"
									icon="material-symbols:search-rounded"
									label="Filter ..."
									on:input={(e) => {
										// Update filter value for this column
										header.column.setFilter(e.target.value);
									}}
								/>
							</th>
						{/each}
					</tr>
				{/if}
			{/each}
		</thead>

		<tbody>
			{#each $table.getRowModel().rows as row, index}
				<tr
					class="divide-x divide-surface-400"
					on:click={() => {
						entryData.set(data?.entryList[index]);
						mode.set('edit');
					}}
				>
					<!-- TODO: Fix divide-y not applying -->
					<td class="!w-6 !divide-x !divide-y !divide-surface-500">
						<DeleteIcon bind:checked={deleteMap[index]} />
					</td>

					{#each row.getVisibleCells() as cell}
						<td>
							{@html cell.getValue()}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>

		<!-- <tfoot>
			{#each $table.getFooterGroups() as footerGroup}
				<tr>
					{#each footerGroup.headers as header}
						<th>
							{#if !header.isPlaceholder}
								<svelte:component this={flexRender(header.column.columnDef.footer, header.getContext())} />
							{/if}
						</th>
					{/each}
				</tr>
			{/each}
		</tfoot> -->
	</table>

	<!-- Pagination -->
	<div class="my-3 flex items-center justify-around text-gray-400">
		<!-- show & count rows -->
		<div class="hidden text-sm text-gray-400 md:block">
			{$LL.TANSTACK_Page()}
			<span class="text-black dark:text-white">{$table.getState().pagination.pageIndex + 1}</span>
			{$LL.TANSTACK_of()}
			<!-- TODO: Get actual pages -->
			<!-- <span class="text-surface-700 dark:text-white">{$table.getState().pagination.pageCount}</span> -->
			<span class="text-black dark:text-white"
				>{Math.ceil($table.getPrePaginationRowModel().rows.length / $table.getState().pagination.pageSize)}</span
			>
			- (<span class="text-black dark:text-white">{$table.getPrePaginationRowModel().rows.length}</span>
			{$LL.TANSTACK_Total()}

			{#if $table.getPrePaginationRowModel().rows.length === 1}
				{$LL.TANSTACK_Row()})
			{:else}
				{$LL.TANSTACK_Rows()})
			{/if}
		</div>

		<!-- number of pages -->
		<select
			value={$table.getState().pagination.pageSize}
			on:change={setPageSize}
			class="text-dark select hidden max-w-[100px] rounded py-2 text-sm dark:bg-gray-800 dark:text-white sm:block"
		>
			{#each [10, 25, 50, 100, 500] as pageSize}
				<option value={pageSize}>
					{pageSize} Rows
				</option>
			{/each}
		</select>

		<!-- next/previous pages -->
		<div class="btn-group variant-ghost inline-flex transition duration-150 ease-in-out [&>*+*]:border-surface-500">
			<button
				type="button"
				class="w-6"
				aria-label="Go to First Page"
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
					class="input w-16 text-black dark:bg-gray-800 dark:text-white"
				/>
				<span class="pl-2">
					{' '}{$LL.TANSTACK_of()}{' '}
					<span class="text-black dark:text-white">{$table.getPageCount()}</span>
				</span>
			</div>

			<button
				type="button"
				class="w-6"
				aria-label="Go to Next Page"
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
				on:click={() => setCurrentPage($table.getPageCount() - 1)}
				class:is-disabled={!$table.getCanNextPage()}
				disabled={!$table.getCanNextPage()}
			>
				<iconify-icon icon="material-symbols:last-page" width="24" />
			</button>
		</div>
	</div>

	<div class="flex flex-col items-center justify-center gap-2 md:hidden">
		<!-- number of pages -->
		<select value={$table.getState().pagination.pageSize} on:change={setPageSize} class="select max-w-[100px] text-sm sm:hidden">
			{#each [10, 25, 50, 100, 500] as pageSize}
				<option value={pageSize}>
					{pageSize}
					{$LL.TANSTACK_Rows()}
				</option>
			{/each}
		</select>

		<!-- Pagination -->
		<div class="text-sm text-gray-400">
			<span class="text-black dark:text-white">{$table.getState().pagination.pageIndex + 1}</span>
			{$LL.TANSTACK_of()}
			<!-- TODO: Get actual page -->
			<!-- <span class="text-surface-700 dark:text-white"
				>{$table.getState().pagination.pageIndex + 1}</span
			> -->
			<span class="text-black dark:text-white"
				>{Math.ceil($table.getPrePaginationRowModel().rows.length / $table.getState().pagination.pageSize)}</span
			>
			- (<span class="text-black dark:text-white">{$table.getPrePaginationRowModel().rows.length}</span>
			{$LL.TANSTACK_Total()}

			{#if $table.getPrePaginationRowModel().rows.length === 1}
				{$LL.TANSTACK_Row()})
			{:else}
				{$LL.TANSTACK_Rows()}){/if}
		</div>
	</div>
</div>

<style lang="postcss">
	/* th,
	td {
		min-width: 120px;
		text-align: left;
		cursor: pointer;
	}	
	thead th:first-of-type {
		border-top-left-radius: 3px;
	}
	thead th:last-of-type {
		border-top-right-radius: 3px;
	}
	tbody tr:last-of-type td:first-of-type {
		border-bottom-left-radius: 3px;
	}
	tbody tr:last-of-type td:last-of-type {
		border-bottom-right-radius: 3px;
	}
	table {
		min-width: calc(100% - 10px);
		margin: auto;
		color: white;
	}
	thead {
		position: sticky;
		top: 0;
		background-color: #3d4a5c;
		font-size: 16px;
	}
	tbody {
		background-color: #202832;
		font-size: 14px;
	}
	tbody tr:hover {
		background-color: #274b6f;
	} */
</style>
