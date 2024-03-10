<script lang="ts">
	import SigninIcon from './icons/SigninIcon.svelte';
	export let active: undefined | 0 | 1 = undefined;
	import Button from '@src/components/system/buttons/Button.svelte';
	import { loginSchema, type LoginSchema } from '@src/utils/formSchemas';
	import CMSLogo from './icons/Logo.svelte';
	import publicConfig from '@root/config/public';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import LoginRecover from './LoginRecover.svelte';
	import EnableIcon from '@src/components/system/buttons/EnableIcon.svelte';
	import { validateZod } from '@src/utils/utils';
	import axios from 'axios';
	import { goto } from '$app/navigation';
	import { parse } from 'devalue';
	import { messages } from '@src/stores/load';
	let submitted = false;
	let loginRecover = false;
	let response;
	let form: LoginSchema = {
		email: '',
		password: '',
		isToken: false
	};

	let errors = validateZod(loginSchema);
	async function onSubmit(e) {
		submitted = true;
		e.preventDefault();
		errors = validateZod(loginSchema, form);
		if (errors) return;
		let data = new FormData();
		for (const [key, value] of Object.entries(form)) {
			data.append(key, value as string);
		}
		let result = await axios.post(`?/signIn`, data).then((res) => res.data);
		if (result.type == 'redirect') {
			goto(result.location);
		} else if (result.type == 'failure') {
			response = parse(result.data).message;
			console.log('deval', response);
			e.target.classList.add('wiggle');
			setTimeout(() => e.target.classList.remove('wiggle'), 300);
		}
	}
	$: if (submitted) errors = validateZod(loginSchema, form);
</script>

<section
	on:click
	on:pointerenter
	class="hover relative flex items-center"
	class:active={active == 0}
	class:inactive={active !== undefined && active !== 0}
	class:hover={active == undefined || active == 1}
>
	{#if !loginRecover}
		<form class="mx-auto mb-[5%] mt-[15%] flex w-full flex-col p-4 lg:w-1/2" class:hide={active != 0} on:submit={onSubmit}>
			<div class="mb-6 flex flex-row gap-2">
				<CMSLogo className="w-12" fill="red" />

				<h1 class="text-3xl font-bold text-black lg:text-4xl">
					<div class="text-xs text-surface-300">{publicConfig.SITE_NAME}</div>
					<div class="lg:-mt-1">{$messages.signIn()}</div>
				</h1>
			</div>
			<FloatingInput name="email" type="email" bind:value={form.email} label={$messages.Email()} />
			{#if errors?.email}<span class="invalid">{errors.email}</span>{/if}

			<FloatingInput name="password" type="password" bind:value={form.password} label={form.isToken ? 'token' : $messages.Password()}>
				<EnableIcon bind:checked={form.isToken} icon={'oi:lock-locked'} class="absolute right-[30px]" />
			</FloatingInput>

			{#if errors?.password}<span class="invalid">{errors.password}</span>{/if}
			{#if response}<span class="invalid">{response}</span>{/if}
			<div class="mt-5 flex gap-2">
				<Button>{$messages.signIn()}</Button>
				<Button
					on:click={(e) => {
						e.preventDefault();
						loginRecover = true;
					}}
					bgColor="white"
					border="1px solid gray"
					textColor="#ff3535">{$messages.ForgotPassword()}</Button
				>
			</div>
		</form>
	{:else}
		<LoginRecover {active} bind:loginRecover />
	{/if}
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
	.invalid {
		color: red;
		font-size: 0.8rem;
	}
</style>
