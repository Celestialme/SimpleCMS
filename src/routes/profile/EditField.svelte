<script lang="ts">
	import { roles } from '@src/auth/types';
	import Button from '@src/components/system/buttons/Button.svelte';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import XIcon from '@src/components/system/icons/XIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import { validateZod } from '@src/utils/utils';
	import axios from 'axios';
	import { z } from 'zod';
	let emailSchema = z.object({
		email: z.string().email()
	});

	let errors = $state(validateZod(emailSchema));
	interface Props {
		info: {
			show: boolean;
			label: string;
			field: string;
			user_ids: string[];
			value: string;
			update: (show: boolean, label: string, field: 'email' | 'role' | 'username') => void;
		};
		refresh: () => Promise<void>;
	}

	let { info = $bindable(), refresh }: Props = $props();
	let submitted = $state(false);
	async function change() {
		if (info.field == 'email') {
			submitted = true;
			errors = validateZod(emailSchema, { email: info.value });
			if (errors) return;
		}

		let data = new FormData();
		for (let user_id of info.user_ids) {
			data.append(
				'info',
				JSON.stringify({
					id: user_id,
					field: info.field,
					value: info.value
				})
			);
		}
		await axios.post(`?/editUser`, data);
		await refresh();
		info.show = false;
	}

	$effect(() => {
		info.show == false && ((info.value = ''), (submitted = false), (errors = null));
	});
	$effect(() => {
		if (submitted) errors = validateZod(emailSchema, { email: info.value });
	});
</script>

{#if info.show}
	<div class=" flex w-full flex-col p-4 lg:w-1/2">
		<button class="ml-auto mb-[20px]" onclick={() => (info.show = false)}>
			<XIcon />
		</button>
		{#if info.field == 'role'}
			<DropDown items={Object.values(roles)} bind:selected={info.value} />
		{:else}
			<FloatingInput
				onkeydown={(e) => e.key == 'Enter' && change()}
				bind:value={info.value}
				iconClass="text-white"
				inputClass="text-white"
				name="field"
				label={info.label}
				theme="dark"
			/>
			{#if errors?.email}<span class="invalid">{errors.email}</span>{/if}
		{/if}

		<Button onclick={change} class="mt-10" bgColor="#e64949" hoverColor="#f46363">change</Button>
	</div>
{/if}

<style>
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
