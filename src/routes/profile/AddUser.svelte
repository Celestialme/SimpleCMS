<script lang="ts">
	export let data: PageData;
	import type { PageData, SubmitFunction } from './$types';
	import '@src/stores/store';
	import LL from '@src/i18n/i18n-svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import { addUserTokenSchema } from '@src/utils/formSchemas';
	import { roles } from '@src/collections/Auth';
	//console.log('roles: ', roles);

	let response;
	console.log(data);
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
</script>

<form
	method="post"
	action="?/addUser"
	use:enhance
	class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2"
>
	<div class="r label">
		{$LL.LOGIN_EmailAddress()}
		<input
			bind:value={$form.email}
			name="email"
			type="email"
			class="input variant-outline-surface"
		/>
	</div>

	{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
	{#if response}<span class="invalid">{response}</span>{/if}

	<label class="label">
		<span>Select User Role</span>
		<select class="select" bind:value={$form.role}>
			{#each Object.values(roles) as role}
				<option value={role}>{role}</option>
			{/each}
		</select>
	</label>

	<button class="btn variant-filled-primary mt-10">Create</button>
</form>

<style>
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
