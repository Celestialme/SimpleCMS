<script lang="ts">
	import type { PageData, SubmitFunction } from './$types';
	export let data: PageData;
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import { changePasswordSchema } from '@src/utils/formSchemas';
	import { superForm } from 'sveltekit-superforms/client';
	import LL from '@src/i18n/i18n-svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import { goto } from '$app/navigation';
	let response;
	let { form, constraints, allErrors, errors, enhance } = superForm(data.changePasswordForm, {
		id: 'changePassword',
		validators: changePasswordSchema,
		defaultValidator: 'clear',
		applyAction: true,
		taintedMessage: '',
		dataType: 'json',

		onSubmit: ({ cancel }) => {
			cancel();
		},
		onResult: ({ result, cancel }) => {
			cancel();
			if (result.type == 'success') {
				response = result.data?.message;
				goto('/');
			}
		}
	});
</script>

<form method="post" action="?/changePassword" use:enhance class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2">
	<FloatingInput
		bind:value={$form.password}
		iconClass="text-white"
		inputClass="text-white"
		name="password"
		type="password"
		label={$LL.LOGIN_Password()}
		theme="dark"
	/>
	{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
	<FloatingInput
		bind:value={$form.confirmPassword}
		iconClass="text-white"
		inputClass="text-white"
		name="confirmPassword"
		type="password"
		label={$LL.LOGIN_ConfirmPassword()}
		theme="dark"
	/>
	{#if $errors.confirmPassword}<span class="invalid">{$errors.confirmPassword}</span>{/if}
	<Button class="bg-white mt-10">change</Button>

	{#if response}<span class="invalid">{response}</span>{/if}
</form>

<style>
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
