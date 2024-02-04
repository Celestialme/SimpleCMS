<script lang="ts">
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import { addUserSchema, type AddUserSchema } from '@src/utils/formSchemas';
	import { roles } from '@src/auth/types';
	import { parse } from 'devalue';
	import { validateZod } from '@src/utils/utils';
	import axios from 'axios';
	export let option: number;
	let submitted = false;
	let response: { data: string; success: boolean } | undefined;
	let form: AddUserSchema = {
		email: '',
		role: ''
	};

	form.role = 'user';
	let errors = validateZod(addUserSchema);
	async function onSubmit(e) {
		submitted = true;
		e.preventDefault();
		errors = validateZod(addUserSchema, form);
		if (errors) return;
		let data = new FormData();
		for (const [key, value] of Object.entries(form)) {
			data.append(key, value as string);
		}
		let result = await axios.post(`?/addUser`, data).then((res) => res.data);
		response = { data: parse(result.data).message, success: result.status == 200 };
		if (response.success) {
			setTimeout(() => (option = 1), 1000);
		}
	}
	$: if (submitted) errors = validateZod(addUserSchema, form);
</script>

<form on:submit={onSubmit} class=" flex w-full flex-col p-4 lg:w-1/2">
	<FloatingInput
		bind:value={form.email}
		iconClass="text-white"
		inputClass="text-white"
		name="email"
		type="email"
		label={'Email Address'}
		theme="dark"
	/>
	{#if errors?.email}<span class="invalid">{errors.email}</span>{/if}
	<DropDown items={Object.values(roles)} bind:selected={form.role} />
	<Button class="mt-10" bgColor="#e64949" hoverColor="#f46363">Create</Button>
	{#if response}<p class="text-center !text-base {response.success ? 'valid' : 'invalid'}">{response.data}</p>{/if}
</form>

<style>
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
	.valid {
		color: #00fe00;
	}
</style>
