<script lang="ts">
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import { changePasswordSchema, type ChangePasswordSchema } from '@src/utils/formSchemas';
	import Button from '@src/components/system/buttons/Button.svelte';
	import { validateZod } from '@src/utils/utils';
	import axios from 'axios';
	import { parse } from 'devalue';
	let submitted = false;
	let response: { data: string; success: boolean } | undefined;
	let form: ChangePasswordSchema = {
		password: '',
		confirmPassword: ''
	};
	let errors = validateZod(changePasswordSchema);
	async function onSubmit(e) {
		submitted = true;
		e.preventDefault();
		errors = validateZod(changePasswordSchema, form);
		if (errors) return;
		let data = new FormData();
		for (const [key, value] of Object.entries(form)) {
			data.append(key, value as string);
		}
		let result = await axios.post(`?/changePassword`, data).then((res) => res.data);
		response = { data: parse(result.data).message, success: result.status == 200 };
	}
	$: if (submitted) errors = validateZod(changePasswordSchema, form);
</script>

<form on:submit={onSubmit} class=" flex w-full flex-col p-4 lg:w-1/2">
	<FloatingInput
		bind:value={form.password}
		iconClass="text-white"
		inputClass="text-white"
		name="password"
		type="password"
		label={'New Password'}
		theme="dark"
	/>
	{#if errors?.password}<span class="invalid">{errors.password}</span>{/if}
	<FloatingInput
		bind:value={form.confirmPassword}
		iconClass="text-white"
		inputClass="text-white"
		name="confirmPassword"
		type="password"
		label={'Confirm Password'}
		theme="dark"
	/>
	{#if errors?.confirmPassword}<span class="invalid">{errors.confirmPassword}</span>{/if}
	<Button class="mt-10" bgColor="#e64949" hoverColor="#f46363">change</Button>

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
