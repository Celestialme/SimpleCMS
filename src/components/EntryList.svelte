<script lang="ts">
	import { mode, entryData, modifyEntry, statusMap } from '@src/stores/store';
	import axios from 'axios';
	import CheckBox from './system/buttons/CheckBox.svelte';
	import { writable } from 'svelte/store';
	import { createSvelteTable, flexRender as flexRenderBugged, getCoreRowModel, getFilteredRowModel, getSortedRowModel } from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';
	import { contentLanguage, collection } from '@src/stores/load';
	import SquareIcon from './system/icons/SquareIcon.svelte';
	import { asAny, debounce, getFieldName } from '@src/utils/utils';
	import FloatingInput from './system/inputs/FloatingInput.svelte';
	let data: { entryList: [any]; totalCount: number } | undefined;
	let tableData: any = [];
	let modifyMap: any = {};
	let deleteAll = false;
	let waitFilter = debounce(300);
	let refresh = async (fetch: boolean = true) => {
		if (fetch) {
			data = (await axios.get(`/api/${$collection.name}?page=${1}&length=${50}`).then((data) => data.data)) as {
				entryList: [any];
				totalCount: number;
			};
		}
		data &&
			(tableData = await Promise.all(
				data.entryList.map(async (entry) => {
					let obj: { [key: string]: any } = {};
					for (let field of $collection.fields) {
						obj[field.label] = await field.display?.({
							data: entry[getFieldName(field)],
							collection: $collection.name,
							field,
							entry,
							contentLanguage: $contentLanguage
						});
					}
					obj._id = entry._id;
					return obj;
				})
			));
		options.update((options) => ({
			...options,
			data: tableData,
			columns: $collection.fields.map((field) => ({
				accessorKey: field.label
			}))
		}));
		modifyMap = {};
		deleteAll = false;
	};
	$: {
		refresh();
		$collection;
	}
	$: {
		refresh(false);
		$contentLanguage;
	}
	$: process_deleteAll(deleteAll);
	$: Object.values(modifyMap).includes(true) ? mode.set('modify') : mode.set('view');
	const options = writable<TableOptions<any>>({
		data: tableData,
		columns: $collection.fields.map((field) => ({
			accessorKey: field.label
		})),
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel()
	});

	$: table = createSvelteTable(options);
	//workaround for svelte-table bug
	let flexRender = flexRenderBugged as (...args: Parameters<typeof flexRenderBugged>) => any;

	function process_deleteAll(deleteAll: boolean) {
		// triggerConfirm = true;
		if (deleteAll) {
			for (let item in tableData) {
				modifyMap[item] = true;
			}
		} else {
			for (let item in modifyMap) {
				modifyMap[item] = false;
			}
		}
	}

	$modifyEntry = async (status: keyof typeof statusMap) => {
		let modifyList: Array<string> = [];
		for (let item in modifyMap) {
			console.log(tableData[item]);
			modifyMap[item] && modifyList.push(tableData[item]._id);
		}
		if (modifyList.length == 0) return;
		let formData = new FormData();
		formData.append('ids', JSON.stringify(modifyList));
		formData.append('status', statusMap[status]);
		switch (status) {
			case 'Delete':
				await axios.delete(`/api/${$collection.name}`, { data: formData });
				break;
			case 'Publish':
			case 'Unpublish':
			case 'Test':
				await axios.patch(`/api/${$collection.name}/setStatus`, formData).then((res) => res.data);
				break;
		}
		refresh();
		mode.set('view');
	};
</script>

<div class="overflow-auto max-h-full">
	<table>
		<thead>
			{#each $table.getHeaderGroups() as headerGroup}
				<tr>
					<th class="!pl-[30px]">
						<iconify-icon icon="il:search" class="mt-[15px]" />
					</th>
					{#each headerGroup.headers as header}
						<th>
							<div class="flex items-center justify-between">
								{#if !header.isPlaceholder}
									<FloatingInput
										type="text"
										label="filter"
										theme="dark"
										name={header.id}
										on:input={(e) => {
											waitFilter(() => {
												header.column.setFilterValue(asAny(e.target).value);
											});
										}}
									/>
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<thead>
			{#each $table.getHeaderGroups() as headerGroup}
				<tr>
					<th class="!pl-[25px]"> <CheckBox bind:checked={deleteAll} svg={SquareIcon} /> </th>
					{#each headerGroup.headers as header}
						<th on:click={header.column.getToggleSortingHandler()}>
							<div class="flex items-center justify-between">
								{#if !header.isPlaceholder}
									<svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />

									<div class="arrow" class:up={header.column.getIsSorted() === 'asc'} class:invisible={!header.column.getIsSorted()} />
								{/if}
							</div>
						</th>
					{/each}
				</tr>
			{/each}
		</thead>
		<tbody>
			{#each $table.getRowModel().rows as row, index}
				<tr
					class={data?.entryList[index]?.status == 'unpublished'
						? '!bg-yellow-700'
						: data?.entryList[index]?.status == 'testing'
						? '!bg-red-800'
						: ''}
					on:click={() => {
						entryData.set(data?.entryList[index]);
						mode.set('edit');
					}}
				>
					<td class="!pl-[25px]"> <CheckBox bind:checked={modifyMap[index]} svg={SquareIcon} /> </td>
					{#each row.getVisibleCells() as cell}
						<td>
							{@html cell.getValue()}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
		<tfoot>
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
		</tfoot>
	</table>
</div>

<style>
	th,
	td {
		text-align: left;
		cursor: pointer;
		font-size: min(max(16px, 1.5vw), 22px);
	}
	thead:first-of-type th:first-of-type {
		border-top-left-radius: 12px;
	}
	thead:first-of-type th:last-of-type {
		border-top-right-radius: 12px;
	}
	tbody tr:last-of-type td:first-of-type {
		border-bottom-left-radius: 12px;
	}
	tbody tr:last-of-type td:last-of-type {
		border-bottom-right-radius: 12px;
	}
	thead th,
	td {
		padding: 10px;
	}
	tbody tr:nth-child(2n + 1) {
		padding: 5px 0;
		background-color: #2c3844;
	}
	table {
		min-width: 100%;

		color: white;
	}
	thead {
		position: sticky;
		top: 0;
		background-color: #3d4a5c;
		font-size: 20px;
	}
	tbody {
		background-color: #202832;
		font-size: 18px;
	}
	tbody tr:hover {
		background-color: #274b6f;
	}
	.arrow {
		border: solid white;
		border-width: 0 4px 4px 0;

		padding: 6px;
		transform: rotate(45deg);
		transform-origin: center;
		transition: 0.2s transform ease-in-out;
	}
	.up {
		transform: rotate(-135deg);
		margin-top: 10px;
	}
</style>
