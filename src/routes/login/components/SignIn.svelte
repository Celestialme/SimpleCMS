<script lang="ts">
	import type { PageData, SubmitFunction } from '../$types';

	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';

	import { loginFormSchema, forgotFormSchema, resetFormSchema } from '@src/utils/formSchemas';

	import SigninIcon from './icons/SigninIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';
	import { PUBLIC_SITENAME } from '$env/static/public';
	import CMSLogo from './icons/Logo.svelte';

	// skeleton
	import { Toast, toastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings } from '@skeletonlabs/skeleton';


	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let active: undefined | 0 | 1 = undefined;
	export const show = false;
	export let forgot = false;
	export let resetPW = false;

	let showPassword = false;

	export let FormSchemaLogin: PageData['loginForm'];
	const { form, constraints, allErrors, errors, enhance, delayed } = superForm(FormSchemaLogin, {
		validators: loginFormSchema,
		// Clear form on success.
		resetForm: true,
		// Prevent page invalidation, which would clear the other form when the load function executes again.
		invalidateAll: false,
		// other options
		defaultValidator: 'keep',
		applyAction: true,
		taintedMessage: '',

		onSubmit: ({ cancel }) => {
			// Submit email as lowercase only
			$form.email = $form.email.toLowerCase();

			//console.log('onSubmit:', form);

			// handle login form submission
			if ($allErrors.length > 0) cancel();
		},

		onResult: ({ result, cancel }) => {
			//console.log('onResult', result);

			if (result.type == 'redirect') {
				// Trigger the toast
				const t = {
					message: $LL.LOGIN_SignInSuccess(),
					// Provide any utility or variant background style:
					background: 'variant-filled-primary',
					timeout: 2000,
					// Add your custom classes here:
					classes: 'border-1 !rounded-md'
				};
				toastStore.trigger(t);
				return;
			}
			cancel();

			// add wiggle animation to form element
			formElement.classList.add('wiggle');
			setTimeout(() => formElement.classList.remove('wiggle'), 300);
		}
	});

	export let FormSchemaForgot: PageData['forgotForm'];
	const {
		form: forgotForm,
		constraints: forgotConstraints,
		allErrors: forgotAllErrors,
		errors: forgotErrors,
		enhance: forgotEnhance,
		delayed: forgotDelayed
	} = superForm(FormSchemaForgot, {
		validators: forgotFormSchema,
		// Clear form on success.
		resetForm: true,
		// Prevent page invalidation, which would clear the other form when the load function executes again.
		invalidateAll: false,
		// other options
		defaultValidator: 'keep',
		applyAction: true,
		taintedMessage: '',

		onSubmit: ({ cancel }) => {
			// Submit email as lowercase only
			$forgotForm.email = $forgotForm.email.toLowerCase();

			// handle login form submission
			if ($allErrors.length > 0) cancel();
		},
		onResult: ({ result, cancel }) => {
			// handle forgot form result
			if (result.type == 'redirect') {
				// update variables to display reset form
				resetPW = true;

				// Trigger the toast
				// TODO: Toast in conflict with wiggle
				const t = {
					message: $LL.LOGIN_ForgottenPassword(),
					// Provide any utility or variant background style:
					background: 'variant-filled-primary',
					// Add your custom classes here:
					classes: 'border-1 !rounded-md'
				};
				toastStore.trigger(t);
				return;
			}
			cancel();

			// add wiggle animation to form element
			formElement.classList.add('wiggle');
			setTimeout(() => formElement.classList.remove('wiggle'), 300);
		}
	});

	export let FormSchemaReset: PageData['resetForm'];
	const {
		form: resetForm,
		constraints: resetConstraints,
		allErrors: resetAllErrors,
		errors: resetErrors,
		enhance: resetEnhance,
		delayed: resetDelayed
	} = superForm(FormSchemaReset, {
		validators: resetFormSchema,
		// Clear form on success.
		resetForm: true,
		// Prevent page invalidation, which would clear the other form when the load function executes again.
		invalidateAll: false,
		// other options
		defaultValidator: 'keep',
		applyAction: true,
		taintedMessage: '',

		onSubmit: ({ cancel }) => {
			// handle login form submission
			if ($allErrors.length > 0) cancel();
		},
		onResult: ({ result, cancel }) => {
			// handle forgot form result
			if (result.type == 'redirect') {
				// update variables to display login form
				forgot = false;
				resetPW = false;

				// Trigger the toast
				const t: ToastSettings = {
					message: 'Password Reset',
					// Provide any utility or variant background style:
					background: 'variant-filled-primary',
					// Add your custom classes here:
					classes: 'border-1 !rounded-md'
				};
				toastStore.trigger(t);
				return;
			}
			cancel();

			// add wiggle animation to form element
			formElement.classList.add('wiggle');
			setTimeout(() => formElement.classList.remove('wiggle'), 300);
		}
	});

	let formElement: HTMLFormElement;
</script>

<Toast />

<!-- svelte-ignore a11y-no-static-element-interactions -->
<section
	on:click
	on:pointerenter
	on:keydown
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

		{#if !forgot && !resetPW}
			<!--<SuperDebug data={$form} />-->
			<form method="post" action="?/signIn" use:enhance bind:this={formElement} class="flex w-full flex-col gap-3" class:hide={active != 0}>
				<!-- Email field -->
				<FloatingInput
					name="email"
					type="email"
					bind:value={$form.email}
					label={$LL.LOGIN_EmailAddress()}
					{...$constraints.email}
					icon="mdi:email"
					iconColor="black"
					textColor="black"
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
					textColor="black"
				/>
				{#if $errors.password}<span class="invalid text-xs text-error-500">{$errors.password}</span>{/if}

				<div class="mt-4 flex items-center justify-between">
					<button type="submit" class="btn variant-filled-surface">
						{$LL.LOGIN_SignIn()}
						<!-- Loading indicators -->
						{#if $delayed}<img src="/spinner.svg" alt="Loading.." class="ml-4 h-6" />{/if}
					</button>

					<button
						type="button"
						class="btn variant-ringed-surface text-black"
						on:click={() => {
							forgot = true;
							resetPW = false;
						}}>{$LL.LOGIN_ForgottenPassword()}</button
					>
				</div>
			</form>
		{/if}

		{#if resetPW && forgot}
			<!--<SuperDebug data={$resetForm} />-->
			<!-- Reset Password -->
			<form method="post" action="?/resetPW" use:resetEnhance bind:this={formElement} class="flex w-full flex-col">
				<!-- Password field -->
				<FloatingInput
					name="password"
					type="password"
					bind:value={$resetForm.password}
					bind:showPassword
					label={$LL.LOGIN_Password()}
					icon="mdi:lock"
					iconColor="black"
					textColor="black"
				/>
				{#if $resetErrors.password}<span class="invalid text-xs text-error-500">{$resetErrors.password}</span>{/if}

				<!-- Password  Confirm field -->
				<FloatingInput
					name="confirm_password"
					type="password"
					bind:value={$resetForm.confirm_password}
					bind:showPassword
					label={$LL.LOGIN_ConfirmPassword()}
					icon="mdi:lock"
					iconColor="black"
					textColor="black"
				/>
				{#if $resetErrors.confirm_password}<span class="invalid text-xs text-error-500">{$resetErrors.confirm_password}</span>{/if}

				<!-- Password field -->
				<FloatingInput type="password" bind:value={$form.password} bind:showPassword label={$LL.LOGIN_Token()} icon="mdi:lock" iconColor="black" />

				<button type="submit" class="btn variant-filled-surface ml-2 mt-6">
					{$LL.LOGIN_ResetPasswordSave()}
					<!-- Loading indicators -->
					{#if $resetDelayed}<img src="/spinner.svg" alt="Loading.." class="ml-4 h-6" />{/if}
				</button>
			</form>
		{/if}

		{#if forgot && !resetPW}
			<!--<SuperDebug data={$forgotForm} />-->
			<!-- Forgotten Password -->
			<form method="post" action="?/forgot" use:forgotEnhance bind:this={formElement} class="flex w-full flex-col">
				<div class="  mb-2 text-center text-sm text-black">
					<p class="mb-2 text-xs">{$LL.LOGIN_ForgottenPassword_text()}</p>
				</div>
				<!-- Email field -->
				<FloatingInput
					name="email"
					type="email"
					bind:value={$forgotForm.email}
					required
					label={$LL.LOGIN_EmailAddress()}
					icon="mdi:email"
					iconColor="black"
					textColor="black"
				/>
				{#if $forgotErrors.email}<span class="invalid text-xs text-error-500">{$forgotErrors.email}</span>{/if}

				<div class="mt-4 flex items-center justify-between">
					<button type="submit" class="btn variant-filled-surface">{$LL.LOGIN_SendResetMail()}</button>
					<!-- Loading indicators -->
					{#if $forgotDelayed}<img src="/spinner.svg" alt="Loading.." class="ml-4 h-6" />{/if}

					<button
						type="button"
						class="btn-icon variant-filled-surface"
						on:click={() => {
							forgot = false;
							resetPW = false;
						}}><iconify-icon icon="mdi:arrow-left-circle" width="38" /></button
					>
				</div>
			</form>
		{/if}
	</div>

	<SigninIcon show={active == 1 || active == undefined} />
</section>

<style lang="postcss">
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

	:global(.wiggle) {
		animation: wiggle 0.3s forwards;
	}
	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(150px);
		}
		50% {
			transform: translateX(-75px);
		}
		75% {
			transform: translateX(200px);
		}
		100% {
			transform: translateX(0px);
		}
	}
</style>
