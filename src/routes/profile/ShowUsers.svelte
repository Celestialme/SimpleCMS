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
	let deleteAll = false;
	let tableHeaders: string[] = [];
	let tableData: any = [];
	let modifyMap: any = {};
	axios.get('/api/getUsers').then((res) => {
		userInfo = res.data;
		userInfo.map((user) => {
			if (user.identifier) {
				let _identifier_type = user?.identifier?.split(':');
				user[_identifier_type[0]] = _identifier_type[1];
				delete user.identifier;
			}
		});
		userInfo[0] && (tableHeaders = Object.keys(userInfo[0]));
		tableHeaders.splice(1, 1, tableHeaders.pop() as string);
		tableData = userInfo;
	});
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
	$: process_deleteAll(deleteAll);
</script>

<div class="overflow-auto max-h-full mb-auto" class:hidden={userInfo.length == 0}>
	<table>
		<thead>
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
								}}
							/>
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<thead>
			<tr>
				<th class="!pl-[25px]"> <CheckBox bind:checked={deleteAll} svg={SquareIcon} /> </th>
				{#each tableHeaders as header}
					<th>
						<div class="flex items-center justify-between">
							{header}
						</div>
					</th>
				{/each}
			</tr>
		</thead>
		<tbody>
			{#each tableData as row, index}
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
</style>
