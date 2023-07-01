<script lang="ts">
	import CMSLogo from './icons/Logo.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import Button from '@src/components/system/buttons/Button.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import LL from '@src/i18n/i18n-svelte';
	import type { PageData, SubmitFunction } from '../$types';
	import { superForm } from 'sveltekit-superforms/client';
	import { recoverSchema } from '@src/utils/formSchemas';

	export let formSchema: PageData['recoverForm'];
	export let active: number | undefined;
	export let loginRecover: boolean;

	let response;
	let { form, constraints, allErrors, errors, enhance } = superForm(formSchema, {
		id: 'recover',
		validators: recoverSchema,
		defaultValidator: 'keep',
		applyAction: true,
		taintedMessage: '',
		clearOnSubmit: 'none',
		onSubmit: (args) => {
			let _args = args as Parameters<SubmitFunction>[0];
			if ($allErrors.length > 0) _args.cancel();
		},
		onResult: ({ result, cancel }) => {
			if (result.type == 'success') {
				response = result.data?.message;
			}
			cancel();
		}
	});
</script>

<form method="post" action="?/recover" use:enhance class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2" class:hide={active != 0}>
	<div class="mb-6 flex flex-row gap-2">
		<CMSLogo className="w-12" fill="red" />

		<h1 class="text-3xl font-bold text-black lg:text-4xl">
			<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
			<div class="lg:-mt-1">{$LL.LOGIN_ForgottenPassword()}</div>
		</h1>
	</div>
	<FloatingInput name="email" type="email" bind:value={$form.email} label={$LL.LOGIN_EmailAddress()} {...$constraints.email} />
	{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
	{#if response}<span class="invalid">{response}</span>{/if}
	<div class=" flex gap-2 mt-10 items-center">
		<Button>{$LL.LOGIN_SendResetMail()}</Button>
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
