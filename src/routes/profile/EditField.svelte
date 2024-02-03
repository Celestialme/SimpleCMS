<script lang="ts">
	import { roles } from '@src/auth/types';
	import Button from '@src/components/system/buttons/Button.svelte';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import axios from 'axios';
	let value: string;
	export let info: {
		show: boolean;
		label: string;
		field: string;
		user_ids: string[];
		update: (show: boolean, label: string, field: 'email' | 'role' | 'username') => void;
	};
	export let refresh: () => Promise<void>;
	async function change() {
		let data = new FormData();
		for (let user_id of info.user_ids) {
			data.append(
				'info',
				JSON.stringify({
					id: user_id,
					field: info.field,
					value
				})
			);
		}
		await axios.post(`?/editUser`, data);
		await refresh();
		info.show = false;
	}
	$: info.show == false && (value = '');
</script>

{#if info.show}
	<div class=" flex w-full flex-col p-4 lg:w-1/2">
		{#if info.field == 'role'}
			<DropDown items={Object.values(roles)} bind:selected={value} />
		{:else}
			<FloatingInput bind:value iconClass="text-white" inputClass="text-white" name="field" label={info.label} theme="dark" />
		{/if}

		<Button on:click={change} class="mt-10" bgColor="#e64949" hoverColor="#f46363">change</Button>
	</div>
{/if}
