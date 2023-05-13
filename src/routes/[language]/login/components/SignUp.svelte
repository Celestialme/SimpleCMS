<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';
	import axios, { toFormData } from 'axios';
	import { credentials } from '@src/stores/load';
	import SignupIcon from './icons/SignupIcon.svelte';
	export let active: undefined | 0 | 1 = undefined;
	import LL from '@src/i18n/i18n-svelte';
	import Input from '@src/components/system/inputs/Input.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { PageData } from '../$types';
	export let formSchema: PageData['signUpForm'];
	import { signUpSchema } from '../formSchemas';
	let userExists = false;
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
	class="relative flex items-center hover"
	class:active={active == 1}
	class:inactive={active !== undefined && active !== 1}
	class:hover={active == undefined || active == 0}
>
	<form method="post" action="?/signUp" use:enhance class="flex flex-col items-center justify-center w-full" class:hide={active != 1}>
		<Input type="email" name="email" bind:value={$form.email} label="email" labelClass="text-white" />
		{#if $errors.email}<span class="text-white">{$errors.email}</span>{/if}
		<Input type="password" name="password" bind:value={$form.password} label="password" labelClass="text-white" />
		{#if $errors.password}<span class="text-white">{$errors.password}</span>{/if}
		{#if userExists}<span class="text-white">User already exists</span>{/if}
		<Button btnClass="mt-10">{$LL.LOGIN_SignUp()}</Button>
	</form>
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
