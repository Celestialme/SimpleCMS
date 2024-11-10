<script lang="ts">
	import { roles } from '@src/auth/types';
	import CheckBox from './system/buttons/CheckBox.svelte';
	import SquareIcon from './system/icons/SquareIcon.svelte';
	import { defaultPermissions, permissions, type Permissions } from '@src/collections/types';
	import deepmerge from 'deepmerge';
	import { track } from '@src/utils/reactivity.svelte';

	let { value = $bindable(defaultPermissions as any) }: { value: Permissions } = $props();
	// track(
	// 	() => (value = deepmerge(defaultPermissions, value || {})),
	// 	() => value
	// );
	value = deepmerge(defaultPermissions, value || {});
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
				onclick={() => {
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
						<CheckBox icon={SquareIcon} bind:checked={value[role][permission]} />
					</td>
				{/each}
			</tr>
		{/each}
	</tbody>
</table>
