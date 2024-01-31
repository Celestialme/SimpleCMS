<script lang="ts">
	export let data: PageData;
	import type { PageData } from './$types';
	import LL from '@src/i18n/i18n-svelte';
	import { superForm } from 'sveltekit-superforms/client';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import { addUserSchema } from '@src/utils/formSchemas';
	import { roles } from '@src/collections/types';
	let response;
	console.log(data);
	let { form, allErrors, errors, enhance } = superForm(data.addUserForm, {
		id: 'addUser',
		validators: addUserSchema,
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

<form method="post" action="?/addUser" use:enhance class=" flex w-full flex-col p-4 lg:w-1/2">
	<FloatingInput
		bind:value={$form.email}
		iconClass="text-white"
		inputClass="text-white"
		name="email"
		type="email"
		label={'Email Address'}
		theme="dark"
	/>
	{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}
	{#if response}<span class="invalid">{response}</span>{/if}
	<DropDown items={Object.values(roles)} bind:selected={$form.role} />
	<Button class="mt-10" bgColor="#e64949" hoverColor="#f46363">Create</Button>
</form>

<style>
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
