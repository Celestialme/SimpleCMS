<script lang="ts">
	import { mode, entryData, modifyEntry, statusMap } from '@src/stores/store';
	import axios from 'axios';
	import CheckBox from './system/buttons/CheckBox.svelte';
	import { contentLanguage, collection } from '@src/stores/load';
	import SquareIcon from './system/icons/SquareIcon.svelte';
	import { asAny, debounce, getFieldName } from '@src/utils/utils';
	import FloatingInput from './system/inputs/FloatingInput.svelte';
	let data: { entryList: [any]; pagesCount: number } | undefined;
	let tableHeaders: Array<{ label: string; name: string }> = [];
	let tableData: any[] = [];
	let modifyMap: { [key: string]: boolean } = {};
	let deleteAll = false;
	let filters: { [key: string]: string } = {};
	let currentPage = 1;
	let waitFilter = debounce(300);
	let refresh = async (fetch: boolean = true) => {
		if (fetch) {
			data = (await axios
				.get(
					`/api/${$collection.name}?page=${currentPage}&length=${10}&filter=${JSON.stringify(filters)}&sort=${JSON.stringify(
						sorting.isSorted
							? {
									[sorting.sortedBy]: sorting.isSorted
							  }
							: {}
					)}`
				)
				.then((data) => data.data)) as {
				entryList: [any];
				pagesCount: number;
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
		tableHeaders = $collection.fields.map((field) => ({ label: field.label, name: getFieldName(field) }));

		modifyMap = {};
		deleteAll = false;
	};
	$: {
		refresh();
		$collection;
		filters;
		sorting;
		currentPage;
	}
	$: {
		refresh(false);
		$contentLanguage;
		filters = {};
	}
	$: {
		currentPage = 1;
		$collection;
	}
	$: process_deleteAll(deleteAll);
	$: Object.values(modifyMap).includes(true) ? mode.set('modify') : mode.set('view');

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
	let sorting: { sortedBy: string; isSorted: 0 | 1 | -1 } = {
		sortedBy: '',
		isSorted: 0
	};
</script>

<div class="overflow-auto max-h-[calc(100vh-55px)]">
	<table>
		<thead class="top-0">
			<tr>
				<th class="!pl-[30px]">
					<iconify-icon icon="il:search" class="mt-[15px]" />
				</th>
				{#each tableHeaders as header}
					<th>
						<div class="flex items-center justify-between">
							<FloatingInput
								type="text"
								label="filter"
								theme="dark"
								name={header.name}
								on:input={(e) => {
									let value = asAny(e.target).value;
									if (value) {
										waitFilter(() => {
											filters[header.name] = value;
										});
									} else {
										delete filters[header.name];
										filters = filters;
									}
								}}
							/>
						</div>
					</th>
				{/each}
			</tr>

			<tr>
				<th class="!pl-[25px]"> <CheckBox bind:checked={deleteAll} svg={SquareIcon} /> </th>
				{#each tableHeaders as header}
					<th
						on:click={() => {
							//sort
							sorting = {
								sortedBy: header.name,
								isSorted: (() => {
									if (header.name !== sorting.sortedBy) {
										return 1;
									}
									if (sorting.isSorted === 0) {
										return 1;
									} else if (sorting.isSorted === 1) {
										return -1;
									} else {
										return 0;
									}
								})()
							};
						}}
					>
						<div class="flex items-center justify-between">
							{header.label}
							<div class="arrow" class:up={sorting.isSorted === 1} class:invisible={sorting.isSorted == 0 || sorting.sortedBy != header.label} />
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each tableData as row, index}
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
					{#each tableHeaders as header}
						<td class="text-center">
							{@html row[header.label]}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
	<div class="pages">
		{#each Array((data?.pagesCount || 0) > 1 ? data?.pagesCount : 0) as _, page}
			<div class="page" on:click={() => (currentPage = page + 1)} class:active={currentPage == page + 1}>
				{page + 1}
			</div>
		{/each}
	</div>
</div>

<style>
	.page.active {
		background-color: aquamarine;
		color: white;
	}
	.pages {
		display: flex;
		justify-content: center;
		margin-top: 20px;
	}
	.page:first-of-type {
		border-top-left-radius: 8px;
		border-bottom-left-radius: 8px;
	}
	.page:last-of-type {
		border-top-right-radius: 8px;
		border-bottom-right-radius: 8px;
	}
	.page {
		border: 1px solid transparent;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 5px 15px;
		cursor: pointer;
		box-shadow: inset 0px 0px 3px 0px #808588;
	}
	.page:hover {
		background-color: aqua;
		color: white;
	}
	th,
	td {
		text-align: left;
		cursor: pointer;
		font-size: min(max(16px, 1.5vw), 22px);
	}
	thead tr:first-of-type th:first-of-type {
		border-top-left-radius: 12px;
	}
	thead tr:first-of-type th:last-of-type {
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
	div::-webkit-scrollbar-thumb {
		border-radius: 50px;
		background-color: #0eb4c4;
	}
	div::-webkit-scrollbar {
		width: 10px;
	}
</style>
