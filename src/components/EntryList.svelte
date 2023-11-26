<script lang="ts">
	import { mode, entryData, modifyEntry, statusMap } from '@src/stores/store';
	import axios from 'axios';
	import CheckBox from './system/buttons/CheckBox.svelte';
	import { writable } from 'svelte/store';
	import { createSvelteTable, flexRender as flexRenderBugged, getCoreRowModel } from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';
	import { contentLanguage, collection } from '@src/stores/load';
	import SquareIcon from './system/icons/SquareIcon.svelte';
	import { getFieldName } from '@src/utils/utils';
	let data: { entryList: [any]; totalCount: number } | undefined;
	let tableData: any = [];
	let modifyMap: any = {};
	let deleteAll = false;
	let refresh = async (collection: typeof $collection) => {
		data = undefined;
		data = (await axios.get(`/api/${$collection.name}?page=${1}&length=${50}`).then((data) => data.data)) as { entryList: [any]; totalCount: number };
		console.log(data);
		tableData = await Promise.all(
			data.entryList.map(async (entry) => {
				let obj: { [key: string]: any } = {};
				for (let field of collection.fields) {
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
		);
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
	$: refresh($collection);
	$: process_deleteAll(deleteAll);
	$: Object.values(modifyMap).includes(true) ? mode.set('modify') : mode.set('view');
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
		refresh($collection);
		mode.set('view');
	};
</script>

<div class="overflow-auto max-h-full">
	<table>
		<thead>
			{#each $table.getHeaderGroups() as headerGroup}
				<tr>
					<th class="!pl-[25px]"> <CheckBox bind:checked={deleteAll} svg={SquareIcon} /> </th>
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
</style>
