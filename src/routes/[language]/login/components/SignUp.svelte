<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import SignupIcon from './icons/SignupIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';

	import Button from '@src/components/system/buttons/Button.svelte';
	import type { PageData } from '../$types';
	import { PUBLIC_SITENAME } from '$env/static/public';

	import CMSLogo from './icons/Logo.svelte';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	import { signUpSchema } from '../formSchemas';

	export let active: undefined | 0 | 1 = undefined;
	export let formSchema: PageData['signUpForm'];

	let userExists = false;
	// TODO grabd this data from Database
	let firstUserExists = false;

	let { form, constraints, allErrors, errors, enhance } = superForm(formSchema, {
		validators: signUpSchema,
		defaultValidator: 'clear',
		applyAction: true,
		taintedMessage: '',

		onSubmit: ({ cancel }) => {
			if ($allErrors.length > 0) cancel();
		},

		onResult: ({ result, cancel }) => {
			if (result.type == 'redirect') return;
			cancel();
			userExists = true;
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
	<div class="mx-auto mb-[5%] mt-[15%] w-full p-4 lg:w-1/2" class:hide={active != 1}>
		<div class="mb-4 flex flex-row gap-2">
			<CMSLogo className="w-12" fill="red" />

			<h1 class="text-3xl font-bold text-white lg:text-4xl">
				<div class="text-xs text-surface-300">{PUBLIC_SITENAME}</div>
				<div class="lg:-mt-1">{$LL.LOGIN_SignUp()}</div>
			</h1>
		</div>

		<div class="-mt-2 text-right text-xs text-error-500">{$LL.LOGIN_Required()}</div>

		<form method="post" action="?/signUp" use:enhance class="flex flex-col" class:hide={active != 1}>
			<!-- Username field -->
			<FloatingInput
				name="Username"
				type="text"
				required
				bind:value={$form.username}
				label={$LL.LOGIN_Username()}
				icon="mdi:user-circle"
				iconColor="white"
				textColor="white"
				inputClass="text-white"
			/>
			{#if $errors.username}<span class="text-xs text-error-500">{$errors.username}</span>{/if}

			<!-- Email field -->
			<FloatingInput
				name="email"
				type="text"
				required
				bind:value={$form.email}
				label={$LL.LOGIN_EmailAddress()}
				icon="mdi:email"
				iconColor="white"
				textColor="white"
				inputClass="text-white"
			/>
			{#if $errors.email}<span class="text-xs text-error-500">{$errors.email}</span>{/if}

			<!-- TODO Check PW & Check to show hide PW together and have matiching PW -->
			<!-- Password field -->
			<FloatingInput
				name="password"
				type="password"
				required
				bind:value={$form.password}
				label={$LL.LOGIN_Password()}
				icon="mdi:password"
				iconColor="white"
				textColor="white"
				showPasswordBackgroundColor="dark"
				inputClass="text-white"
			/>
			{#if $errors.password}<span class="text-xs text-error-500">{$errors.password}</span>{/if}

			<!-- Password Confirm -->
			<FloatingInput
				name="confirm_password"
				type="password"
				required
				bind:value={$form.confirm_password}
				label={$LL.LOGIN_ConfirmPassword()}
				icon="mdi:password"
				iconColor="white"
				textColor="white"
				showPasswordBackgroundColor="dark"
				inputClass="text-white"
			/>
			{#if $errors.confirm_password}<span class="text-xs text-error-500">{$errors.confirm_password}</span>{/if}

			<!-- Registration Token -->
			{#if firstUserExists}
				<FloatingInput
					name="token"
					required
					type="text"
					bind:value={$form.token}
					label={$LL.LOGIN_Token()}
					icon="mdi:key-chain"
					iconColor="white"
					textColor="white"
					inputClass="text-white"
				/>
				{#if $errors.token}<span class="text-xs text-error-500">{$errors.token}</span>{/if}
			{/if}

			{#if userExists}<span class="text-xs text-error-500">User already exists</span>{/if}

			<Button backgroundColor="white" btnClass="mt-6 ml-2">{$LL.LOGIN_SignUp()}</Button>
		</form>
	</div>

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
</style>
