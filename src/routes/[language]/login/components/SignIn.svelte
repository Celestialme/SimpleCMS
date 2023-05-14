<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';
	import axios, { toFormData } from 'axios';
	import { credentials } from '@src/stores/load';
	import SigninIcon from './icons/SigninIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';
	import Input from '@src/components/system/inputs/Input.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { PageData } from '../$types';
	import { loginSchema } from '../formSchemas';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import CMSLogo from './icons/Logo.svelte';
	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let active: undefined | 0 | 1 = undefined;
	export let show = false;
	export let forgot = false;
	export let resetPW = false;

	let showPassword = false;

	export let formSchema: PageData['loginForm'];
	let { form, constraints, allErrors, errors, enhance } = superForm(formSchema, {
		validators: loginSchema,
		defaultValidator: 'keep',
		applyAction: true,
		taintedMessage: '',
		clearOnSubmit: 'none',
		onSubmit: ({ cancel }) => {
			// if ($allErrors.length > 0) cancel();
		},
		onResult: ({ result, cancel }) => {
			if (result.type == 'redirect') return;
			cancel();
			formElement.classList.add('wiggle');
			setTimeout(() => formElement.classList.remove('wiggle'), 300);
		}
	});
	let formElement: HTMLFormElement;
</script>

<section
	on:click
	on:pointerenter
	class="hover relative flex items-center"
	class:active={active == 0}
	class:inactive={active !== undefined && active !== 0}
	class:hover={active == undefined || active == 1}
>
	<div class="mx-auto mb-[5%] mt-[15%] w-full p-4 lg:w-1/2" class:hide={active != 0}>
		<div class="mb-1 flex flex-row gap-2">
			<CMSLogo className="w-12" fill="red" />

			<h1 class="text-3xl font-bold text-black lg:text-4xl">
				<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
				{#if !forgot}
					<div class="lg:-mt-1">{$LL.LOGIN_SignIn()}</div>
				{:else if forgot}
					<div class="text-2xl lg:-mt-1 lg:text-4xl">{$LL.LOGIN_ForgottenPassword()}</div>
				{:else}
					<div class="lg:-mt-1">{$LL.LOGIN_ResetPassword()}</div>
				{/if}
			</h1>
		</div>
		<div class="-mt-2 text-right text-xs text-error-500">{$LL.LOGIN_Required()}</div>

		<form method="post" action="?/signIn" use:enhance bind:this={formElement} class="flex w-full flex-col" class:hide={active != 0}>
			{#if !forgot && !resetPW}
				<!-- Email field -->
				<FloatingInput
					name="email"
					type="text"
					bind:value={$form.email}
					label={$LL.LOGIN_EmailAddress()}
					{...$constraints.email}
					icon="mdi:email"
					iconColor="black"
				/>
				{#if $errors.email}<span class="invalid text-xs text-error-500">{$errors.email}</span>{/if}

				<!-- Password field -->
				<FloatingInput
					name="password"
					type="password"
					bind:value={$form.password}
					{...$constraints.password}
					bind:showPassword
					label={$LL.LOGIN_Password()}
					icon="mdi:lock"
					iconColor="black"
				/>
				{#if $errors.password}<span class="invalid text-xs text-error-500">{$errors.password}</span>{/if}

				<div>
					<Button backgroundColor="black" btnClass="mt-6 ml-2">{$LL.LOGIN_SignIn()}</Button>
					<Button
						backgroundColor="white"
						size="sm"
						btnClass="ml-5 border border-black !rounded-lg"
						on:click={() => {
							forgot = true;
							resetPW = false;
						}}>{$LL.LOGIN_ForgottenPassword()}</Button
					>
				</div>
			{:else if resetPW && forgot}
				<!-- Reset Password -->

				<!-- Password field -->
				<FloatingInput
					name="password"
					type="password"
					bind:value={$form.password}
					bind:showPassword
					label={$LL.LOGIN_Password()}
					icon="mdi:lock"
					iconColor="black"
				/>
				{#if $errors.password}<span class="invalid text-xs text-error-500">{$errors.password}</span>{/if}

				<!-- Password  Confirm field -->
				<FloatingInput
					name="confirm_password"
					type="password"
					bind:value={$form.confirm_password}
					bind:showPassword
					label={$LL.LOGIN_ConfirmPassword()}
					icon="mdi:lock"
					iconColor="black"
				/>
				{#if $errors.confirm_password}<span class="invalid text-xs text-error-500">{$errors.confirm_password}</span>{/if}

				<!-- Password field -->
				<FloatingInput type="password" bind:value={$form.password} bind:showPassword label={$LL.LOGIN_Token()} icon="mdi:lock" iconColor="black" />

				<Button backgroundColor="black" btnClass="mt-6 ml-2">{$LL.LOGIN_ResetPasswordSave()}</Button>
			{:else}
				<!-- Forgotten Password -->
				<!-- Email field -->
				<FloatingInput
					name="email"
					type="text"
					bind:value={$form.email}
					required
					label={$LL.LOGIN_EmailAddress()}
					icon="mdi:email"
					iconColor="black"
				/>
				{#if $errors.email}<span class="invalid text-xs text-error-500">{$errors.email}</span>{/if}

				<div>
					<Button backgroundColor="black" btnClass="mt-6 ml-2">{$LL.LOGIN_SendResetMail()}</Button>
					<Button
						backgroundColor="black"
						btnClass="circular-btn mt-6 ml-2"
						iconLeft="mdi:arrow-left-circle"
						on:click={() => {
							forgot = false;
							resetPW = false;
						}}
					/>
				</div>
			{/if}
		</form>
	</div>

	<SigninIcon show={active == 1 || active == undefined} />
</section>

<style>
	.hide {
		transition: 0s;
		opacity: 0;
	}
	section {
		--width: 0%;
		background: white;
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
		border-top-right-radius: 5% 50%;
		border-bottom-right-radius: 5% 50%;
		width: calc(var(--width) + 10%);
	}
</style>
