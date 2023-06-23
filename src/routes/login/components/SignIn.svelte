<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import SigninIcon from './icons/SigninIcon.svelte';
	export let active: undefined | 0 | 1 = undefined;
	import LL from '@src/i18n/i18n-svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { PageData } from '../$types';
	import { loginSchema } from '@src/utils/formSchemas';
	import CMSLogo from './icons/Logo.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import LoginRecover from './LoginRecover.svelte';
	export let formSchema: PageData['loginForm'];
	export let recoverFormSchema: PageData['recoverForm'];
	let loginRecover = false;
	let { form, constraints, allErrors, errors, enhance } = superForm(formSchema, {
		id: 'signin',
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
	{#if !loginRecover}
		<form
			method="post"
			action="?/signIn"
			use:enhance
			bind:this={formElement}
			class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2"
			class:hide={active != 0}
		>
			<div class="mb-6 flex flex-row gap-2">
				<CMSLogo className="w-12" fill="red" />

				<h1 class="text-3xl font-bold text-black lg:text-4xl">
					<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
					<div class="lg:-mt-1">{$LL.LOGIN_SignIn()}</div>
				</h1>
			</div>
			<FloatingInput name="email" type="email" bind:value={$form.email} label={$LL.LOGIN_EmailAddress()} {...$constraints.email} />
			{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

			<FloatingInput name="password" type="password" bind:value={$form.password} {...$constraints.password} label={$LL.LOGIN_Password()} />
			{#if $errors.password}<span class="invalid">{$errors.password}</span>{/if}
			<div class="mt-5 flex gap-2">
				<Button>{$LL.LOGIN_SignIn()}</Button>
				<Button
					on:click={(e) => {
						e.preventDefault();
						loginRecover = true;
					}}
					bgColor="white"
					border="1px solid gray"
					textColor="#ff3535">{$LL.LOGIN_ForgottenPassword()}</Button
				>
			</div>
		</form>
	{:else}
		<LoginRecover formSchema={recoverFormSchema} {active} bind:loginRecover />
	{/if}
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
