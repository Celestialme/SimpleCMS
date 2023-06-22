<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import SignupIcon from './icons/SignupIcon.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';

	import type { PageData } from '../$types';
	import { PUBLIC_SITENAME } from '$env/static/public';

	import CMSLogo from './icons/Logo.svelte';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	import { signUpFormSchema, signUpOtherFormSchema } from '../formSchemas';

	export let firstUserExists = false;
	console.log('firstUserExists', firstUserExists);

	export let active: undefined | 0 | 1 = undefined;

	let userExists = false;

	export let FormSchemaSignUp: PageData['signUpForm'];
	const { form, constraints, allErrors, errors, enhance } = superForm(FormSchemaSignUp, {
		validators: signUpFormSchema,
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
			if (result.type == 'redirect') return;

			cancel();

			// add wiggle animation to form element
			formElement.classList.add('wiggle');
			setTimeout(() => formElement.classList.remove('wiggle'), 300);

			userExists = true;
		}
	});

	export let FormSchemaSignUpOther: PageData['signUpFormOther'];
	const {
		form: otherForm,
		constraints: otherConstraints,
		allErrors: otherAllErrors,
		errors: otherErrors,
		enhance: otherEnhance
	} = superForm(FormSchemaSignUpOther, {
		validators: signUpOtherFormSchema,
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
			if (result.type == 'redirect') return;

			cancel();

			// add wiggle animation to form element
			formElement.classList.add('wiggle');
			setTimeout(() => formElement.classList.remove('wiggle'), 300);

			userExists = true;
		}
	});

	let formElement: HTMLFormElement;
</script>

<section
	on:click
	on:pointerenter
	on:keydown
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
				<div class="lg:-mt-1">
					{$LL.LOGIN_SignUp()}
					{#if !firstUserExists}
						as Admin
					{:else}
						<!-- TODO: Grab token User Role -->
						as User XX
					{/if}
				</div>
			</h1>
		</div>

		<div class="-mt-2 text-right text-xs text-error-500">{$LL.LOGIN_Required()}</div>

		{#if !firstUserExists}
			<form method="post" action="?/signUp" use:enhance bind:this={formElement} class="flex flex-col" class:hide={active != 1}>
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
					type="email"
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

				{#if userExists}<span class="text-xs text-error-500">User already exists</span>{/if}

				<button type="submit" class="btn variant-filled ml-2 mt-4 uppercase">{$LL.LOGIN_SignUp()}</button>
			</form>
		{:else}
			<!-- TODO: Check if this repetition is really required for Registration Token -->
			<form method="post" action="?/signUp" use:otherEnhance bind:this={formElement} class="flex flex-col" class:hide={active != 1}>
				<!-- Username field -->
				<FloatingInput
					name="Username"
					type="text"
					required
					bind:value={$otherForm.username}
					label={$LL.LOGIN_Username()}
					icon="mdi:user-circle"
					iconColor="white"
					textColor="white"
					inputClass="text-white"
				/>
				{#if $otherErrors.username}<span class="text-xs text-error-500">{$otherErrors.username}</span>{/if}

				<!-- Email field -->
				<FloatingInput
					name="email"
					type="email"
					required
					bind:value={$otherForm.email}
					label={$LL.LOGIN_EmailAddress()}
					icon="mdi:email"
					iconColor="white"
					textColor="white"
					inputClass="text-white"
				/>
				{#if $otherErrors.email}<span class="text-xs text-error-500">{$otherErrors.email}</span>{/if}

				<!-- TODO Check PW & Check to show hide PW together and have matiching PW -->
				<!-- Password field -->
				<FloatingInput
					name="password"
					type="password"
					required
					bind:value={$otherForm.password}
					label={$LL.LOGIN_Password()}
					icon="mdi:password"
					iconColor="white"
					textColor="white"
					showPasswordBackgroundColor="dark"
					inputClass="text-white"
				/>
				{#if $otherErrors.password}<span class="text-xs text-error-500">{$otherErrors.password}</span>{/if}

				<!-- Password Confirm -->
				<FloatingInput
					name="confirm_password"
					type="password"
					required
					bind:value={$otherForm.confirm_password}
					label={$LL.LOGIN_ConfirmPassword()}
					icon="mdi:password"
					iconColor="white"
					textColor="white"
					showPasswordBackgroundColor="dark"
					inputClass="text-white"
				/>
				{#if $otherErrors.confirm_password}<span class="text-xs text-error-500">{$otherErrors.confirm_password}</span>{/if}

				<!-- Registration Token -->
				{#if firstUserExists}
					<FloatingInput
						name="token"
						required
						type="text"
						bind:value={$otherForm.token}
						label={$LL.LOGIN_Token()}
						icon="mdi:key-chain"
						iconColor="white"
						textColor="white"
						inputClass="text-white"
					/>
					{#if $otherErrors.token}<span class="text-xs text-error-500">{$otherErrors.token}</span>{/if}
				{/if}

				{#if userExists}<span class="text-xs text-error-500">User already exists</span>{/if}

				<button type="submit" class="btn variant-filled ml-2 mt-4 uppercase">{$LL.LOGIN_SignUp()}</button>
			</form>
		{/if}
	</div>

	<SignupIcon show={active == 0 || active == undefined} />
</section>

<style lang="postcss">
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
