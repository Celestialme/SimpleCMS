<script lang="ts">
	// Props
	/** Exposes parent props to this component. */
	export let parent: any;

	import { PUBLIC_USER_ROLES } from '$env/static/public';

	// Skelton & Stores
	import { modalStore } from '@skeletonlabs/skeleton';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';
	import { enhance } from '$app/forms';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';

	// Base Classes
	const cBase = 'card p-4 w-modal shadow-xl space-y-4';
	const cHeader = 'text-2xl font-bold';
	const cForm = 'border border-surface-500 p-4 space-y-4 rounded-container-token';

	let email = '';

	// Get allowed user Roles from environment variable
	const rolesArray = PUBLIC_USER_ROLES.split(',');
	const roles = Object.fromEntries(rolesArray.map((role) => [role, false]));
	roles['Editor'] = true;

	// define default role
	let roleSelected = 'Editor';

	let errorStatus = {
		email: { status: false, msg: '' },
		valid: { status: false, msg: '' }
	};

	function filterRole(role: string): void {
		for (const r in roles) {
			if (r !== role) {
				roles[r] = false;
			}
		}
		roles[role] = !roles[role];
	}

	// Token Valid Duration
	let validSelected = '12 hrs';
	let valids: Record<string, boolean> = {
		'2 hrs': false,
		'12 hrs': true,
		'2 days': false,
		'1 week': false,
		'1 month': false
	};

	function filterValid(valid: string): void {
		for (const v in valids) {
			if (v !== valid) {
				valids[v] = false;
			}
		}
		valids[valid] = !valids[valid];
	}
</script>

<!-- @component This example creates a simple form modal. -->

<div class="modal-example-form {cBase}">
	<header class={`text-center text-primary-500 ${cHeader}`}>
		{$modalStore[0]?.title ?? '(title missing)'}
	</header>
	<article class="text-center text-sm">
		{$modalStore[0]?.body ?? '(body missing)'}
	</article>

	<!-- Enable for debugging: -->
	<!-- <pre>{JSON.stringify(formData, null, 2)}</pre> -->
	<form
		class="modal-form {cForm}"
		method="post"
		action="?/generateToken"
		use:enhance={({ data, cancel }) => {
			data.append('role', roleSelected);
			let expires_in = 120;
			// converting it in milliseconds
			switch (validSelected) {
				case '2 hrs':
					expires_in = 2 * 60 * 60 * 1000;
					break;
				case '12 hrs':
					expires_in = 12 * 60 * 60 * 1000;
					break;
				case '2 Days':
					expires_in = 48 * 60 * 60 * 1000;
					break;
				case '1 Week':
					expires_in = 7 * 24 * 60 * 60 * 1000;
					break;
				case '1 Month':
					expires_in = 30 * 24 * 60 * 60 * 1000;
					break;
				default:
					errorStatus['valid'].status = true;
					errorStatus['valid'].msg = 'Invalid value for token validity';
					cancel();
			}
			data.append('expires_in', expires_in.toString());
			return async ({ result }) => {
				if (result.type === 'success') {
					modalStore.close();
				}
				if (result.type === 'failure') {
					result?.data?.errors &&
						// @ts-ignore
						result?.data?.errors.forEach((error) => {
							errorStatus[error.field].status = true;
							errorStatus[error.field].msg = error.message;
						});
				}
			};
		}}
	>
		<!-- Email field -->
		<div class="group relative z-0 mb-6 w-full">
			<FloatingInput label={$LL.LOGIN_EmailAddress()} icon="mdi:email" type="email" bind:value={email} required />

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
					{#each Object.keys(roles) as r}
						<span
							class="chip {roles[r] ? 'variant-filled-tertiary' : 'variant-ghost-secondary'}"
							on:click={() => {
								filterRole(r);
								roleSelected = r;
							}}
							on:keypress
							role="button"
							tabindex="0"
						>
							{#if roles[r]}<span><iconify-icon icon="fa:check" /></span>{/if}
							<span class="capitalize">{r}</span>
						</span>
					{/each}
				</div>
			</div>
		</div>

		<div class="flex flex-col gap-2 pb-6 sm:flex-row">
			<div class="sm:w-1/4">Token validity:</div>
			<div class="flex-auto">
				<div class="flex flex-wrap gap-2 space-x-2">
					{#each Object.keys(valids) as v}
						<span
							class="chip {valids[v] ? 'variant-filled-tertiary' : 'variant-ghost-secondary'}"
							on:click={() => {
								filterValid(v);
								validSelected = v;
							}}
							on:keypress
							role="button"
							tabindex="0"
						>
							{#if valids[v]}<span><iconify-icon icon="fa:check" /></span>{/if}
							<span class="capitalize">{v}</span>
						</span>
					{/each}
				</div>
				{#if errorStatus.valid.status}
					<div class="mt-1 text-xs text-error-500">
						{errorStatus.valid.msg}
					</div>
				{/if}
			</div>
		</div>

		<footer class="modal-footer {parent.regionFooter}">
			<button class="btn {parent.buttonNeutral}" on:click={parent.onClose}>{parent.buttonTextCancel}</button>
			<button type="submit" class="btn {parent.buttonPositive}">Send</button>
		</footer>
	</form>
</div>
