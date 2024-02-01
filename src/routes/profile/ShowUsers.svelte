<script lang="ts">
	import axios from 'axios';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import CheckBox from '@src/components/system/buttons/CheckBox.svelte';
	import SquareIcon from '@src/components/system/icons/SquareIcon.svelte';
	import { asAny } from '@src/utils/utils';
	let userInfo: {
		createdAt: string;
		identifier?: string;
		role: string;
		ID: string;
		username: string;
	}[] = [];
	let modifyAll = false;
	let tableHeaders: string[] = [];
	let tableData: any[] = [];
	let filteredTableData: any[] = [];
	let modifyMap: { [key: string]: boolean } = {};
	let filters: { [key: string]: string } = {};
	async function refresh() {
		userInfo = await axios.get('/api/getUsers').then((data) => data.data);

		userInfo.map((user) => {
			if (user.identifier) {
				let _identifier_type = user?.identifier?.split(':');
				user[_identifier_type[0]] = _identifier_type[1];
				delete user.identifier;
				user.createdAt = new Date(user.createdAt).toLocaleString();
			}
			for (let item in user) {
				console.log(item);
				if (!user[item]) user[item] = 'NO DATA';
			}
		});
		userInfo[0] && (tableHeaders = Object.keys(userInfo[0]));
		tableHeaders.splice(1, 0, tableHeaders.pop() as string);
		tableData = [...userInfo];
	}
	refresh();
	function process_modifyAll(modifyAll: boolean) {
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
	$: process_modifyAll(modifyAll);
	let sorting: { sortedBy: string; isSorted: 0 | 1 | -1 } = {
		sortedBy: '',
		isSorted: 0
	};
	$: {
		tableData.sort((a, b) => {
			if (sorting.sortedBy == 'createdAt') {
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
		tableData = tableData;
	}

	$: {
		filteredTableData = tableData.filter((item) => {
			return Object.entries(item).every(([key, value]) => {
				if (filters[key]) {
					return (value as string).toString().toLowerCase().includes(filters[key]);
				} else {
					return true;
				}
			});
		});
	}
	async function deleteUser() {
		let data = new FormData();
		for (let item in modifyMap) {
			modifyMap[item] && data.append('id', filteredTableData[item].ID);
			delete modifyMap[item];
		}
		await axios.post('?/deleteUser', data);
		await refresh();
		modifyMap = modifyMap;
	}
</script>

<div class="overflow-auto max-h-[calc(100vh-20px)] w-full mb-auto" class:hidden={userInfo.length == 0}>
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
								name={header}
								on:input={(e) => {
									let value = asAny(e.target).value;
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
				<th class="!pl-[25px]"> <CheckBox bind:checked={modifyAll} svg={SquareIcon} /> </th>
				{#each tableHeaders as header}
					<th
						on:click={() => {
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
							{header}
							<div class="arrow" class:up={sorting.isSorted === 1} class:invisible={sorting.isSorted == 0 || sorting.sortedBy != header} />
						</div>
					</th>
				{/each}
			</tr>
			{#if Object.values(modifyMap).includes(true)}
				<tr class="sticky h-[50px]">
					<div class="h-[50px] gap-2 absolute flex justify-center w-full bg-[#3d4a5c] modify_buttons">
						<button on:click={deleteUser}>DELETE</button>
						<button>EDIT MAIL</button>
						<button>EDIT NAME</button>
						<button>EDIT ROLE</button>
					</div>
				</tr>
			{/if}
		</thead>
		<tbody>
			{#each filteredTableData as row, index}
				<tr>
					<td class="!pl-[25px]"> <CheckBox bind:checked={modifyMap[index]} svg={SquareIcon} /> </td>
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
