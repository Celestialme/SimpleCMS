<script lang="ts">
	import SignupIcon from './icons/SignupIcon.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import {
		signUpSchema_noToken,
		signUpSchema_token,
		type SignupSchema
	} from '@src/utils/formSchemas';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import CMSLogo from './icons/Logo.svelte';
	import publicConfig from '@root/config/public';
	import { validateZod } from '@src/utils/utils';
	import axios from 'axios';
	import { parse } from 'devalue';
	import type { PageData } from '../$types';
	import { page } from '$app/stores';
	import { messages } from '@src/stores/load';

	let {
		active,
		onclick,
		onpointerenter
	}: {
		active: undefined | 0 | 1;
		onclick: () => void;
		onpointerenter: () => void;
	} = $props();

	let pageData = $page.data as PageData;
	let firstUserExists = pageData.firstUserExists;
	let response: string | undefined = $state();
	let submitted = $state(false);
	let signUpSchema = firstUserExists ? signUpSchema_token : signUpSchema_noToken;
	let form: SignupSchema = $state({
		...{ email: '', password: '', confirmPassword: '', username: '' },
		...(firstUserExists ? { token: '' } : {})
	});

	if ('Token' in form) {
		form.Token;
	}
	let errors = $state(validateZod(signUpSchema));
	async function onSubmit(e) {
		submitted = true;
		e.preventDefault();
		errors = validateZod(signUpSchema, form);
		if (errors) return;
		let data = new FormData();
		for (const [key, value] of Object.entries(form)) {
			data.append(key, value as string);
		}
		let result = await axios.post(`?/signUp`, data).then((res) => res.data);
		if (result.type == 'redirect') {
			window.location = result.location;
		} else if (result.type == 'failure') {
			response = parse(result.data).message;
		}
	}
	$effect(() => {
		if (submitted) errors = validateZod(signUpSchema, form);
	});
</script>

<section
	{onclick}
	{onpointerenter}
	class="hover relative flex items-center"
	class:active={active == 1}
	class:inactive={active !== undefined && active !== 1}
	class:hover={active == undefined || active == 0}
>
	<form
		onsubmit={onSubmit}
		class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2"
		class:hide={active != 1}
	>
		<div class="mb-6 flex flex-row gap-2">
			<CMSLogo className="w-12" fill="red" />

			<h1 class="text-3xl font-bold text-white lg:text-4xl">
				<div class="text-xs text-[#b1b3c5]">{publicConfig.SITE_NAME}</div>
				<div class="lg:-mt-1">
					{$messages.signUp()}
					{#if !firstUserExists}
						as Admin
					{:else}
						<!-- TODO: Grab token user Role -->
						as User
					{/if}
				</div>
			</h1>
		</div>
		<FloatingInput
			iconClass="text-white"
			inputClass="text-white"
			name="username"
			type="text"
			leading_icon="mdi:user-circle"
			bind:value={form.username}
			label={$messages.Username()}
			theme="dark"
		/>
		{#if errors?.username}<span class="invalid">{errors.username}</span>{/if}
		<FloatingInput
			iconClass="text-white"
			inputClass="text-white"
			name="email"
			type="email"
			bind:value={form.email}
			label={$messages.Email()}
			theme="dark"
		/>
		{#if errors?.email}<span class="invalid">{errors.email}</span>{/if}

		<FloatingInput
			iconClass="text-white"
			inputClass="text-white"
			name="password"
			type="password"
			bind:value={form.password}
			label={$messages.Password()}
			theme="dark"
		/>
		{#if errors?.password}<span class="invalid">{errors.password}</span>{/if}
		<FloatingInput
			iconClass="text-white"
			inputClass="text-white"
			name="confirmPassword"
			type="password"
			bind:value={form.confirmPassword}
			label={$messages.ConfirmPassword()}
			theme="dark"
		/>
		{#if errors?.confirmPassword}<span class="invalid">{errors.confirmPassword}</span>{/if}
		{#if 'token' in form}
			<FloatingInput
				iconClass="text-white"
				inputClass="text-white"
				name="token"
				type="password"
				bind:value={form.token}
				label={'Token'}
				theme="dark"
			/>
		{/if}
		{#if errors && 'token' in errors}<span class="invalid">{errors.token}</span>{/if}
		{#if response}<p class="text-center !text-base invalid">{response}</p>{/if}
		<Button class="bg-white mt-10">{$messages.signUp()}</Button>
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
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
