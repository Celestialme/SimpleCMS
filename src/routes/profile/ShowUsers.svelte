<script lang="ts">
	import axios from 'axios';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import CheckBox from '@src/components/system/buttons/CheckBox.svelte';
	import SquareIcon from '@src/components/system/icons/SquareIcon.svelte';
	import { parse } from 'devalue';
	import EditField from './EditField.svelte';
	import { linear } from 'svelte/easing';
	import { track } from '@src/utils/reactivity.svelte';

	const tableHeaders = ['id', 'email', 'username', 'role', '_createdAt'] as const;
	let editField: {
		show: boolean;
		label: string;
		field: string;
		user_ids: string[];
		value: string;
		update: (show: boolean, label: string, field: 'email' | 'role' | 'username') => void;
	} = $state({
		show: false as boolean,
		label: 'Email',
		field: 'email',
		user_ids: [] as string[],
		value: '',
		update(show, label, field) {
			this.show = show;
			this.label = label;
			this.field = field;
			this.user_ids = Object.keys(modifyMap)
				.map((index) => modifyMap[index] && filteredTableData[index].id)
				.filter((id) => id !== false);
			let index = Object.values(modifyMap).findIndex((value) => value == true);
			this.value = filteredTableData[index][this.field] || '';
		}
	});
	let userInfo: {
		[key in (typeof tableHeaders)[number]]: string;
	}[] = $state([]);
	let modifyAll = $state(false);
	let tableData: typeof userInfo = $state([]);
	let modifyMap: { [key: number]: boolean } = $state({});
	let filters: { [key: string]: string } = $state({});

	async function refresh() {
		let form = new FormData();
		form.append('tableHeaders', JSON.stringify(tableHeaders));
		form.append('filters', JSON.stringify(filters));
		userInfo = await axios.post('?/getUsers', form).then((data) => parse(data.data.data));

		userInfo.map((user) => {
			for (let header of tableHeaders) {
				if (!user[header]) user[header] = 'NO DATA';
				if (header == '_createdAt') user[header] = new Date(user[header]).toLocaleString();
			}
		});
		tableData = [...userInfo];
	}
	refresh();
	function process_modifyAll() {
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
	track(
		() => {
			process_modifyAll();
		},
		() => modifyAll
	);
	let sorting: { sortedBy: string; isSorted: 0 | 1 | -1 } = $state({
		sortedBy: '',
		isSorted: 0
	});
	$effect(() => {
		tableData.sort((a, b) => {
			if (sorting.sortedBy == '_createdAt') {
				if (new Date(a[sorting.sortedBy]) < new Date(b[sorting.sortedBy])) {
					return -1 * sorting.isSorted;
				} else if (new Date(a[sorting.sortedBy]) > new Date(b[sorting.sortedBy])) {
					return 1 * sorting.isSorted;
				} else {
					return 0;
				}
			}

			if (a[sorting.sortedBy] < b[sorting.sortedBy]) {
				return -1 * sorting.isSorted;
			} else if (a[sorting.sortedBy] > b[sorting.sortedBy]) {
				return 1 * sorting.isSorted;
			} else {
				return 0;
			}
		});
	});

	let filteredTableData = $derived(
		tableData.filter((item) => {
			return Object.entries(item).every(([key, value]) => {
				if (filters[key]) {
					return (value as string).toString().toLowerCase().includes(filters[key]);
				} else {
					return true;
				}
			});
		})
	);
	async function deleteUser() {
		let data = new FormData();
		for (let index in modifyMap) {
			modifyMap[index] && data.append('id', filteredTableData[index].id);
			delete modifyMap[index];
		}
		await axios.post('?/deleteUser', data);
		await refresh();
		modifyMap = modifyMap;
	}
	function grow(node, { delay = 0, duration = 400, easing: easing$1 = linear } = {}) {
		const o = parseInt(getComputedStyle(node).height.replace('px', ''));
		return {
			delay,
			duration,
			easing: easing$1,
			css: (t) => `height: ${t * o}px`
		};
	}
	$inspect(modifyMap);
</script>

<div
	class="overflow-auto max-h-[calc(100vh-20px)] w-full mb-auto"
	class:hidden={userInfo.length == 0 || editField.show == true}
>
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
								name={header}
								oninput={(e) => {
									let value = (e.target as any).value;
									if (value) {
										filters[header] = value;
									} else {
										delete filters[header];
										filters = filters;
									}
								}}
							/>
						</div>
					</th>
				{/each}
			</tr>

			<tr>
				<th class="!pl-[25px]"> <CheckBox bind:checked={modifyAll} icon={SquareIcon} /> </th>
				{#each tableHeaders as header}
					<th
						onclick={() => {
							//sort
							sorting = {
								sortedBy: header,
								isSorted: (() => {
									if (header !== sorting.sortedBy) {
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
							{header.replace(/^_/, '')}
							<div
								class="arrow"
								class:up={sorting.isSorted === 1}
								class:invisible={sorting.isSorted == 0 || sorting.sortedBy != header}
							></div>
						</div>
					</th>
				{/each}
			</tr>
			{#if Object.values(modifyMap).includes(true)}
				<tr transition:grow|local={{ duration: 150 }} class="h-[50px] sticky overflow-hidden">
					<td
						transition:grow|local={{ duration: 150 }}
						class="!p-0 h-[50px] overflow-hidden gap-2 absolute flex justify-center w-full bg-[#3d4a5c] modify_buttons"
					>
						<button onclick={deleteUser}>DELETE</button>
						{#if Object.values(modifyMap).filter((value) => value == true).length == 1}
							<button
								onclick={() => {
									editField.update(true, 'Email', 'email');
								}}>EDIT MAIL</button
							>
							<button
								onclick={() => {
									editField.update(true, 'Name', 'username');
								}}>EDIT NAME</button
							>
						{/if}
						<button
							onclick={() => {
								editField.update(true, 'Role', 'role');
							}}>EDIT ROLE</button
						>
					</td>
				</tr>
			{/if}
		</thead>
		<tbody>
			{#each filteredTableData as row, index}
				<tr onclick={() => (modifyMap[index] = !modifyMap[index])}>
					<td class="!pl-[25px]">
						<CheckBox bind:checked={modifyMap[index]} icon={SquareIcon} />
					</td>
					{#each tableHeaders as header}
						<td class="text-center">
							{@html row[header]}
						</td>
					{/each}
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<EditField bind:info={editField} {refresh} />

<style>
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
	div::-webkit-scrollbar-thumb {
		border-radius: 50px;
		background-color: #0eb4c4;
	}
	div::-webkit-scrollbar {
		width: 10px;
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
	.modify_buttons button {
		cursor: pointer;
		border: #d2d2d2 1px solid;
		padding: 0 10px;
		margin-bottom: 5px;
		background: white;
		border-radius: 5px;
		text-align: center;
		color: black;
		flex-basis: max(5%, 130px);
	}
	.modify_buttons button:hover {
		box-shadow: 0px 0px 10px 3px rgb(255 255 255 / 70%);
	}
	button:active {
		transform: scale(0.9);
	}
</style>
