<script lang="ts">
	import { mode } from '@src/stores/store';
	import { collection } from '@src/stores/load';
	import { entryValue } from '@src/stores/widgetStore';
	import axios from 'axios';
	import { writable } from 'svelte/store';
	import { createSvelteTable, flexRender as flexRenderBugged, getCoreRowModel } from '@tanstack/svelte-table';
	import type { ColumnDef, TableOptions } from '@tanstack/table-core/src/types';
	let data: { entryList: [any]; totalCount: number } | undefined;
	let tableData: any = [];
	let refresh = async (collection: typeof $collection) => {
		data = undefined;
		data = (await axios.get(`/api/${$collection.name}?page=${1}&length=${50}`).then((data) => data.data)) as { entryList: [any]; totalCount: number };
		tableData = await Promise.all(
			data.entryList.map(async (entry) => {
				let obj: { [key: string]: any } = {};
				for (let field of collection.fields) {
					obj[field.label] = await field.display(entry[field.label]?.en || entry[field.label], field, entry);
				}
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
	};
	$: refresh($collection);
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
</script>

<table>
	<thead>
		{#each $table.getHeaderGroups() as headerGroup}
			<tr>
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
					entryValue.set(data?.entryList[index]);
					mode.set('edit');
				}}
			>
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
		text-align: center;
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
		padding: 5px 0;
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
