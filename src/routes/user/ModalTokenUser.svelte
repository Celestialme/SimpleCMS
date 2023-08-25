<script lang="ts">
	export let data: PageData;
	import type { PageData, SubmitFunction } from './$types';
	import '@src/stores/store';
	import { superForm } from 'sveltekit-superforms/client';
	//import { enhance } from '$app/forms';

	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';
	import { addUserTokenSchema } from '@src/utils/formSchemas';
	import { roles } from '@src/collections/Auth';
	//console.log('roles: ', roles);

	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	// Skelton & Stores

	import { getModalStore } from '@skeletonlabs/skeleton';

	const modalStore = getModalStore();

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	let response: any;
	//console.log(data);

	let { form, constraints, allErrors, errors, enhance } = superForm(data.addUserForm, {
		id: 'addUser',
		validators: addUserTokenSchema,
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
			}
		}
	});
	$form.role = 'User';

	// Define errorStatus
	let errorStatus: Record<string, { status: boolean; msg: string }> = {
		email: { status: false, msg: '' },
		role: { status: false, msg: '' },
		expiresIn: { status: false, msg: '' },
		valid: { status: false, msg: '' }
	};

	let email = '';
	// define default role
	let roleSelected = Object.values(roles)[1];

	// Token Expires in Duration
	let expiresIn: number;
	let expiresInSelected: string = '12 hrs'; // Initialize expiresInSelected with a default value

	switch (expiresInSelected) {
		case '2 hrs':
			expiresIn = 2 * 60 * 60 * 1000;
			break;
		case '12 hrs': //default expires value
			expiresIn = 12 * 60 * 60 * 1000;
			break;
		case '2 days':
			expiresIn = 2 * 24 * 60 * 60 * 1000;
			break;
		case '1 week':
			expiresIn = 7 * 24 * 60 * 60 * 1000;
			break;
		default:
			errorStatus['expiresIn'].status = true;
			errorStatus['expiresIn'].msg = 'Invalid value for token validity';
			// Cancel function needs to be defined here or you can perform a different action
			break;
	}
</script>

<!-- @component This example creates a simple form modal. -->

<div class="modal-example-form {cBase}">
	<header class={`text-center dark:text-primary-500 ${cHeader}`}>
		{$modalStore[0]?.title ?? '(title missing)'}
	</header>
	<article class="text-center text-sm">
		{$modalStore[0]?.body ?? '(body missing)'}
	</article>

	<!-- Enable for debugging: -->
	<!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
	<form class="modal-form {cForm}" method="post" action="?/addUser" use:enhance>
		<!-- Email field -->
		<div class="group relative z-0 mb-6 w-full">
			<FloatingInput
				label={$LL.LOGIN_EmailAddress()}
				icon="mdi:email"
				type="email"
				bind:value={$form.email}
				required
			/>

			{#if errorStatus.email.status}
				<div class="absolute left-0 top-11 text-xs text-error-500">
					{errorStatus.email.msg}
				</div>
			{/if}
		</div>

		<!-- User Role  -->
		<div class="flex flex-col gap-2 sm:flex-row">
			<div class="sm:w-1/4">User Role:</div>
			<div class="flex-auto">
				<div class="flex flex-wrap gap-2 space-x-2">
					{#each Object.values(roles) as r}
						<span
							class="chip {roleSelected === r
								? 'variant-filled-tertiary'
								: 'variant-ghost-secondary'}"
							on:click={() => {
								// filterRole(r);
								roleSelected = r;
							}}
							on:keypress
							role="button"
							tabindex="0"
						>
							{#if roleSelected === r}<span><iconify-icon icon="fa:check" /></span>{/if}
							<span class="capitalize">{r}</span>
						</span>
					{/each}
				</div>
			</div>
		</div>

		<!-- Token validity  -->
		<div class="flex flex-col gap-2 pb-6 sm:flex-row">
			<div class="sm:w-1/4">Token validity:</div>
			<div class="flex-auto">
				<div class="flex flex-wrap gap-2 space-x-2">
					{#each ['2 hrs', '12 hrs', '2 days', '1 week'] as v}
						<span
							class="chip {expiresInSelected === v
								? 'variant-filled-tertiary'
								: 'variant-ghost-secondary'}"
							on:click={() => {
								expiresInSelected = v;
							}}
							on:keypress
							role="button"
							tabindex="0"
						>
							{#if expiresInSelected === v}<span><iconify-icon icon="fa:check" /></span>{/if}
							<span class="capitalize">{v}</span>
						</span>
					{/each}
				</div>
				{#if errorStatus.expiresIn.status}
					<div class="mt-1 text-xs text-error-500">
						{errorStatus.expiresIn.msg}
					</div>
				{/if}
			</div>
		</div>

		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}
				>{parent.buttonTextCancel}</button
			>
			<button type="submit" class="btn {parent.buttonPositive}">Send</button>
		</footer>
	</form>
</div>
