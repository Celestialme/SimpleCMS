<script lang="ts">
	import { roles } from '@src/auth/types';
	import CheckBox from './system/buttons/CheckBox.svelte';
	import SquareIcon from './system/icons/SquareIcon.svelte';
	import { basePermissions, permissions } from '@src/collections/types';
	import deepmerge from 'deepmerge';

	export let value = basePermissions as any;
	$: value = deepmerge(basePermissions, value || {});
</script>

<table class="table">
	<thead class="top-0">
		<tr>
			<th class="!pl-[30px]"> Role </th>
			{#each permissions as permission}
				<th class="!pl-[30px]"> {permission} </th>
			{/each}
		</tr>
	</thead>
	<tbody>
		{#each roles.filter((r) => r !== 'admin') as role}
			<tr
				on:click={() => {
					let toggle = permissions.some((p) => {
						return value[role][p] == true;
					});

					for (let permission of permissions) {
						value[role][permission] = toggle ? false : true;
					}
				}}
			>
				<td class="!pl-[30px]"> {role} </td>
				{#each permissions as permission}
					<td class="!pl-[30px]">
						<CheckBox svg={SquareIcon} bind:checked={value[role][permission]} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
