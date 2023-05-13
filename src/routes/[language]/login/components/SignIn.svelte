<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
	import { goto } from '$app/navigation';
	import axios, { toFormData } from 'axios';
	import { credentials } from '@src/stores/load';
	import SigninIcon from './icons/SigninIcon.svelte';
	export let active: undefined | 0 | 1 = undefined;
	import LL from '@src/i18n/i18n-svelte';
	import Input from '@src/components/system/inputs/Input.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import type { PageData } from '../$types';
	import { loginSchema } from '../formSchemas';

	export let formSchema: PageData['loginForm'];
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
	class="relative flex items-center hover"
	class:active={active == 0}
	class:inactive={active !== undefined && active !== 0}
	class:hover={active == undefined || active == 1}
>
	<form method="post" action="?/signIn" use:enhance bind:this={formElement} class="flex flex-col items-center w-full" class:hide={active != 0}>
		<Input type="email" name="email" bind:value={$form.email} label="email" {...$constraints.email} />
		{#if $errors.email}<span class="invalid">{$errors.email}</span>{/if}

		<Input type="password" name="password" bind:value={$form.password} label="password" {...$constraints.password} />
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
</style>
