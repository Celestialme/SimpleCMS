<script lang="ts">
	import CMSLogo from './icons/Logo.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import Button from '@src/components/system/buttons/Button.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import { recoverSchema, type RecoverSchema } from '@src/utils/formSchemas';
	import { parse } from 'devalue';
	import axios from 'axios';
	import { validateZod } from '@src/utils/utils';
	import { messages } from '@src/stores/load';
	export let active: number | undefined;
	export let loginRecover: boolean;
	let submitted = false;
	let form: RecoverSchema = {
		email: ''
	};
	let response;
	let errors = validateZod(recoverSchema);
	async function onSubmit(e) {
		submitted = true;
		e.preventDefault();
		errors = validateZod(recoverSchema, form);
		if (errors) return;
		let data = new FormData();
		for (const [key, value] of Object.entries(form)) {
			data.append(key, value as string);
		}
		let result = await axios.post(`?/recover`, data).then((res) => res.data);
		response = parse(result.data).message;
	}
	$: if (submitted) errors = validateZod(recoverSchema, form);
</script>

<form on:submit={onSubmit} class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2" class:hide={active != 0}>
	<div class="mb-6 flex flex-row gap-2">
		<CMSLogo className="w-12" fill="red" />

		<h1 class="text-3xl font-bold text-black lg:text-4xl">
			<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
			<div class="lg:-mt-1">{$messages.ForgotPassword()}</div>
		</h1>
	</div>
	<FloatingInput name="email" type="email" bind:value={form.email} label={$messages.Email()} />
	{#if errors?.email}<span class="invalid">{errors.email}</span>{/if}
	{#if response}<span class="invalid">{response}</span>{/if}
	<div class=" flex gap-2 mt-10 items-center">
		<Button>{$messages.SendPasswordReset()}</Button>
		<button
			on:click={() => {
				loginRecover = false;
			}}><iconify-icon icon="mdi:arrow-left-circle" width="30" /></button
		>
	</div>
</form>

<style>
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
