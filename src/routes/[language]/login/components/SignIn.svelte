<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SigninIcon from './icons/SigninIcon.svelte';
	export let active: undefined | 0 | 1 = undefined;
	import LL from '@src/i18n/i18n-svelte';
	import Input from '@src/components/system/inputs/Input.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { PageData } from '../$types';
	import { loginSchema } from '../formSchemas';
	import CMSLogo from './icons/Logo.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	export let formSchema: PageData['loginForm'];
	let forgotten = false;
	let { form, constraints, allErrors, errors, enhance } = superForm(formSchema, {
		validators: loginSchema,
		defaultValidator: 'keep',
		applyAction: true,
		taintedMessage: '',
		clearOnSubmit: 'none',
		onSubmit: ({ cancel }) => {
			if ($allErrors.length > 0) cancel();
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
	<form
		method="post"
		action="?/signIn"
		use:enhance
		bind:this={formElement}
		class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2"
		class:hide={active != 0}
	>
		<div class="mb-1 flex flex-row gap-2">
			<CMSLogo className="w-12" fill="red" />

			<h1 class="text-3xl font-bold text-black lg:text-4xl">
				<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
				{#if !forgotten}
					<div class="lg:-mt-1">{$LL.LOGIN_SignIn()}</div>
				{:else if forgotten}
					<div class="text-2xl lg:-mt-1 lg:text-4xl">{$LL.LOGIN_ForgottenPassword()}</div>
				{:else}
					<!-- <div class="lg:-mt-1">{$LL.LOGIN_ResetPassword()}</div> -->
				{/if}
			</h1>
		</div>
		<FloatingInput name="email" type="email" bind:value={$form.email} label={$LL.LOGIN_EmailAddress()} {...$constraints.email} />
		{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

		<FloatingInput name="password" type="password" bind:value={$form.password} {...$constraints.password} label={$LL.LOGIN_Password()} />
		{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}

		<Button btnClass="mt-10">{$LL.LOGIN_SignIn()}</Button>
	</form>
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
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
