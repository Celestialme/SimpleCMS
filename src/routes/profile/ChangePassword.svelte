<script lang="ts">
	import type { PageData, SubmitFunction } from './$types';
	export let data: PageData;
	import { changePasswordSchema } from '@src/utils/formSchemas';
	import { superForm } from 'sveltekit-superforms/client';
	import LL from '@src/i18n/i18n-svelte';
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
			if ($allErrors.length > 0) cancel();
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

<div class="bg-gray-400">
	Change PW

	<form method="post" action="?/changePassword" use:enhance class="mx-auto mb-[5%] flex w-full flex-col p-4 lg:w-1/2">
		<input bind:value={$form.password} name="password" type="password" placeholder={$LL.LOGIN_Password()} />
		{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
		<input bind:value={$form.confirm_password} name="confirmPassword" type="password" placeholder={$LL.LOGIN_ConfirmPassword()} />
		{#if $errors.confirm_password}<span class="invalid">{$errors.confirm_password}</span>{/if}
		<button class="btn variant-filled-tertiary mt-10">Change</button>

		{#if response}<span class="invalid">{response}</span>{/if}
	</form>
</div>

<style>
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
