<script lang="ts">
	import { collection, modifyEntry, statusMap } from '@src/stores/store.svelte';
	import CheckBox from './system/buttons/CheckBox.svelte';

	import { contentLanguage } from '@src/stores/store.svelte';
	import SquareIcon from './system/icons/SquareIcon.svelte';
	import { debounce, meta_data } from '@src/utils/utils';
	import FloatingInput from './system/inputs/FloatingInput.svelte';
	import { deleteData, getData, setStatus } from '@src/utils/data';
	import { entryData, mode } from '@src/stores/store.svelte';
	import { track } from '@src/utils/reactivity.svelte';
	import { getFieldName } from '@src/utils/fields';
	let data: { entryList: [any]; pagesCount: number } | undefined = $state();
	let tableHeaders: Array<{ label: string; name: string }> = $state([]);
	let tableData: any[] = $state([]);
	let modifyMap: { [key: string]: boolean } = $state({});
	let selectAll = $state(false);
	let filters: { [key: string]: string } = $state({});
	let currentPage = $state(1);
	let waitFilter = debounce(300);
	let refresh = async (fetch: boolean = true) => {
		if (fetch) {
			data = await getData({
				collectionName: collection().path as any,
				page: currentPage,
				limit: 2,
				contentLanguage: contentLanguage(),
				filter: JSON.stringify(filters),
				sort: JSON.stringify(
					sorting.isSorted
						? {
								[sorting.sortedBy]: sorting.isSorted
							}
						: {}
				)
			});
		}
		data &&
			(tableData = await Promise.all(
				data.entryList.map(async (entry) => {
					let obj: { [key: string]: any } = {};
					for (let field of collection().fields) {
						if ('callback' in field) {
							field.callback({ data });
						}
						obj[field.label] = await field.display?.({
							data: entry[getFieldName(field)],
							collection: collection().path,
							field,
							entry,
							contentLanguage: contentLanguage()
						});
					}
					obj._id = entry._id;
					return obj;
				})
			));
		tableHeaders = collection().fields.map((field) => ({
			label: field.label,
			name: getFieldName(field)
		}));

		modifyMap = {};
		selectAll = false;
	};
	mode.subscribe(() => {
		meta_data.clear();
		if (mode() == 'view') {
			entryData.set({});
		}
	});
	function set_selectAll(modifyAll: boolean) {
		if (modifyAll) {
			for (let item in tableData) {
				modifyMap[item] = true;
			}
		} else {
			for (let item in modifyMap) {
				modifyMap[item] = false;
			}
		}
	}

	modifyEntry.set(async (status: keyof typeof statusMap) => {
		let modifyList: Array<string> = [];
		for (let item in modifyMap) {
			modifyMap[item] && modifyList.push(tableData[item]._id);
		}
		if (modifyList.length == 0) return;
		let formData = new FormData();
		formData.append('ids', JSON.stringify(modifyList));
		formData.append('status', statusMap[status]);
		switch (status) {
			case 'Delete':
				await deleteData({ data: formData, collectionName: collection().path as any });
				break;
			case 'Publish':
			case 'Unpublish':
			case 'Test':
				await setStatus({ data: formData, collectionName: collection().path as any });
				break;
		}
		refresh();

		mode.set('view');
	});
	let sorting: { sortedBy: string; isSorted: 0 | 1 | -1 } = $state({
		sortedBy: '',
		isSorted: 0
	});
	track(
		() => {
			refresh(false);
			filters = {};
		},
		() => contentLanguage()
	);
	$effect(() => {
		currentPage = 1;
		collection();
	});
	track(refresh, () => [collection(), $state.snapshot(filters), sorting, currentPage]);

	$effect(() => {
		Object.values(modifyMap).includes(true) ? mode.set('modify') : mode.set('view');
	});
</script>

<div class="overflow-auto max-h-[calc(100vh-55px)]">
	<table>
		<thead class="top-0">
			<tr>
				<th class="!pl-[30px]">
					<iconify-icon icon="il:search" class="mt-[15px]"></iconify-icon>
				</th>
				{#each tableHeaders as header}
					<th>
						<div class="flex items-center justify-between">
							<FloatingInput
								type="text"
								label="filter"
								theme="dark"
								name={header.name}
								value={filters[header.name]}
								oninput={(e) => {
									let value = (e.target as any).value;
									if (value) {
										waitFilter(() => {
											filters[header.name] = value;
										});
									} else {
										delete filters[header.name];
									}
								}}
							/>
						</div>
					</th>
				{/each}
			</tr>

			<tr>
				<th class="!pl-[25px]">
					<CheckBox
						bind:checked={selectAll}
						onchange={() => set_selectAll(selectAll)}
						icon={SquareIcon}
					/>
				</th>
				{#each tableHeaders as header}
					<th
						onclick={() => {
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
							<div
								class="arrow"
								class:up={sorting.isSorted === 1}
								class:invisible={sorting.isSorted == 0 || sorting.sortedBy != header.label}
							></div>
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		{#key data}
			<tbody>
				{#each tableData as row, index}
					<tr
						class={data?.entryList[index]?.status == 'unpublished'
							? '!bg-yellow-700'
							: data?.entryList[index]?.status == 'testing'
								? '!bg-red-800'
								: ''}
						onclick={() => {
							entryData.set(data?.entryList[index]);
							mode.set('edit');
						}}
					>
						<td class="!pl-[25px]">
							{#if !data?.entryList[index]?._is_link}
								<CheckBox bind:checked={modifyMap[index]} icon={SquareIcon} />
							{:else}
								<p>link</p>
							{/if}
						</td>
						{#each tableHeaders as header}
							<td class="text-center">
								{@html row[header.label]}
							</td>
						{/each}
					</tr>
				{/each}
			</tbody>
		{/key}
	</table>
	<div class="pages">
		{#each Array((data?.pagesCount || 0) > 1 ? data?.pagesCount : 0) as _, page}
			<div
				class="page"
				onclick={() => (currentPage = page + 1)}
				class:active={currentPage == page + 1}
			>
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
	thead th:not(:first-of-type) {
		min-width: 100px;
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
