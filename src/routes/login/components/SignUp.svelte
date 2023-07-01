<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SignupIcon from './icons/SignupIcon.svelte';
	export let active: undefined | 0 | 1 = undefined;
	import LL from '@src/i18n/i18n-svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { PageData, SubmitFunction } from '../$types';
	export let formSchema: PageData['signUpForm'];
	import { signUpSchema } from '@src/utils/formSchemas';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import CMSLogo from './icons/Logo.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';

	let response;
	let firstUserExists = formSchema.data.token != null;
	let { form, constraints, allErrors, errors, enhance } = superForm(formSchema, {
		id: 'signup',
		validators: (firstUserExists ? signUpSchema : signUpSchema.innerType().omit({ token: true })) as typeof signUpSchema,
		defaultValidator: 'clear',
		applyAction: true,
		taintedMessage: '',

		onSubmit: (args) => {
			let _args = args as Parameters<SubmitFunction>[0];
			if ($allErrors.length > 0) _args.cancel();
		},
		onResult: ({ result, cancel }) => {
			console.log(result);
			console.log($errors);
			if (result.type == 'redirect') return;
			cancel();
			if (result.type == 'success') {
				response = result.data?.message;
			}
		}
	});
</script>

<section
	on:click
	on:pointerenter
	class="hover relative flex items-center"
	class:active={active == 1}
	class:inactive={active !== undefined && active !== 1}
	class:hover={active == undefined || active == 0}
>
	<form method="post" action="?/signUp" use:enhance class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2" class:hide={active != 1}>
		<div class="mb-6 flex flex-row gap-2">
			<CMSLogo className="w-12" fill="red" />

			<h1 class="text-3xl font-bold text-white lg:text-4xl">
				<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
				<div class="lg:-mt-1">
					{$LL.LOGIN_SignUp()}
					{#if !firstUserExists}
						as Admin
					{:else}
						<!-- TODO: Grab token user Role -->
						as User
					{/if}
				</div>
			</h1>
		</div>
		<FloatingInput
			iconClass="text-white"
			inputClass="text-white"
			name="username"
			type="text"
			leading_icon="mdi:user-circle"
			bind:value={$form.username}
			label={$LL.LOGIN_Username()}
			{...$constraints.username}
			theme="dark"
		/>
		{#if $errors.username}<span class="invalid">{$errors.username}</span>{/if}
		<FloatingInput
			iconClass="text-white"
			inputClass="text-white"
			name="email"
			type="email"
			bind:value={$form.email}
			label={$LL.LOGIN_EmailAddress()}
			{...$constraints.email}
			theme="dark"
		/>
		{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

		<FloatingInput
			iconClass="text-white"
			inputClass="text-white"
			name="password"
			type="password"
			bind:value={$form.password}
			{...$constraints.password}
			label={$LL.LOGIN_Password()}
			theme="dark"
		/>
		{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
		<FloatingInput
			iconClass="text-white"
			inputClass="text-white"
			name="confirmPassword"
			type="password"
			bind:value={$form.confirmPassword}
			{...$constraints.confirmPassword}
			label={'confirm password'}
			theme="dark"
		/>
		{#if $errors.confirmPassword}<span class="invalid">{$errors.confirmPassword}</span>{/if}
		{#if $form.token != null}
			<FloatingInput
				iconClass="text-white"
				inputClass="text-white"
				name="token"
				type="password"
				bind:value={$form.token}
				{...$constraints.token}
				label={'Token'}
				theme="dark"
			/>
		{/if}
		{#if $errors.token}<span class="invalid">{$errors.token}</span>{/if}
		{#if response}<span class="invalid">{response}</span>{/if}
		<Button class="bg-white mt-10">{$LL.LOGIN_SignUp()}</Button>
	</form>
	<SignupIcon show={active == 0 || active == undefined} />
</section>

<style>
	.hide {
		transition: 0s;
		opacity: 0;
	}
	section {
		--width: 0%;
		background: #242728;
		flex-grow: 1;
		width: var(--width);
		transition: 0.4s;
	}
	.active {
		--width: 90%;
	}
	.inactive {
		--width: 10%;
	}
	.hover:hover {
		border-top-left-radius: 5% 50%;
		border-bottom-left-radius: 5% 50%;
		width: calc(var(--width) + 10%);
	}
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
