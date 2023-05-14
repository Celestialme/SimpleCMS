<script lang="ts">
	import { collection } from '@src/collections';
	import { mode, entryData, deleteEntry } from '@src/stores/store';
	import axios from 'axios';
	import DeleteIcon from './DeleteIcon.svelte';
	import { writable } from 'svelte/store';
	import { createSvelteTable, flexRender as flexRenderBugged, getCoreRowModel } from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';
	import { contentLanguage } from '@src/stores/load';
	let data: { entryList: [any]; totalCount: number } | undefined;
	let tableData: any = [];
	let deleteMap: any = {};
	let deleteAll = false;
	let refresh = async (collection: typeof $collection) => {
		data = undefined;
		data = (await axios.get(`/api/${$collection.name}?page=${1}&length=${50}`).then((data) => data.data)) as { entryList: [any]; totalCount: number };
		tableData = await Promise.all(
			data.entryList.map(async (entry) => {
				let obj: { [key: string]: any } = {};
				for (let field of collection.fields) {
					obj[field.label] = await field.display?.(entry[field.label], field, entry, $contentLanguage);
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
	$: refresh($collection);
	$: process_deleteAll(deleteAll);
	$: Object.values(deleteMap).includes(true) ? mode.set('delete') : mode.set('view');
	const options = writable<TableOptions<any>>({
		data: tableData,
		columns: $collection.fields.map((field) => ({
			accessorKey: field.label
		})),
		getCoreRowModel: getCoreRowModel()
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
			console.log(tableData[item]);
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

<table>
	<thead>
		{#each $table.getHeaderGroups() as headerGroup}
			<tr>
				<th class="!pl-[25px]"> <DeleteIcon bind:checked={deleteAll} /> </th>
				{#each headerGroup.headers as header}
					<th>
						{#if !header.isPlaceholder}
							<svelte:component this={flexRender(header.column.columnDef.header, header.getContext())} />
						{/if}
					</th>
				{/each}
			</tr>
		{/each}
	</thead>
	<tbody>
		{#each $table.getRowModel().rows as row, index}
			<tr
				on:click={() => {
					entryData.set(data?.entryList[index]);
					mode.set('edit');
				}}
			>
				<td class="!pl-[25px]"> <DeleteIcon bind:checked={deleteMap[index]} /> </td>
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

<style>
	th,
	td {
		min-width: 120px;
		text-align: left;
		cursor: pointer;
	}
	thead th:first-of-type {
		border-top-left-radius: 12px;
	}
	thead th:last-of-type {
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
		padding: 5px 10px;
	}
	tbody tr:nth-child(2n + 1) {
		padding: 5px 0;
		background-color: #2c3844;
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
		font-size: 20px;
	}
	tbody {
		background-color: #202832;
		font-size: 18px;
	}
	tbody tr:hover {
		background-color: #274b6f;
	}
</style>
