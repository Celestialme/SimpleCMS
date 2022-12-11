<script lang="ts">
	import Icon from '@iconify/svelte';
	import env from '@root/env';
	import axios from 'axios';
	import { Button, FloatingLabelInput, Helper } from 'flowbite-svelte';
	import { credentials } from '@src/stores/store';
	import CMSLogo from './icons/Logo.svelte';
	import { goto } from '$app/navigation';
	export let show: boolean = false;
	let showPassword: boolean = false;
	let email = '';
	let errorStatus = {
		email: { status: false, msg: '' },
		confirm: { status: false, msg: '' },
		password: { status: false, msg: '' }
	};
	let password = '';
	let confirmPassword = '';

	async function signup() {
		email = email.trim();
		let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		let error = false;

		if (!emailRegex.test(email)) {
			errorStatus.email.status = true;
			errorStatus.email.msg = 'please type valid Email';
			error = true;
		}
		if (!/\.\w+$/.test(email)) {
			errorStatus.email.msg = 'Email should be ending with domain (eg .com)';
		}
		if (!email.includes('@')) {
			errorStatus.email.msg = 'Email should contain @ symbol';
		}
		if (!email) {
			errorStatus.email.msg = 'Email field should not be empty';
		}
		if (!password) {
			errorStatus.password.msg = 'Password field should not be empty';
			errorStatus.password.status = true;
			error = true;
		}

		if (password !== confirmPassword) {
			errorStatus.confirm.msg = 'Passwords Does not Match';
			errorStatus.confirm.status = true;
			error = true;
		}

		if (error) return;
		let resp = (
			await axios.post(
				`${env.API}/signup`,
				{ email, password },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;
		if (resp.status == 200) {
			$credentials = resp;
			goto('/');
		}
	}
</script>

<div class:hide={!show} class="w-full duration-[2000ms] opacity-100">
	<div class="w-full lg:w-1/2 mx-auto p-4  mt-[15%] mb-[5%]">
		<div class="flex flex-row gap-2 mb-8">
			<CMSLogo className="w-10" fill="red" />

			<h1 class="text-3xl font-bold text-white">SimpleCMS - Sign Up</h1>
		</div>

		<!-- Email field -->

		<FloatingLabelInput
			id="floating_email"
			name="email"
			type="text"
			on:keydown={() => (errorStatus.email.status = false)}
			color={errorStatus.email.status ? 'red' : 'base'}
			label="Email Address"
			class="mb-10 !text-white"
			bind:value={email}
		/>
		{#if errorStatus.email.status}
			<Helper class="mb-5 -mt-4" color="red">{errorStatus.email.msg}</Helper>
		{/if}
		<div class="relative">
			<!-- password field -->
			<FloatingLabelInput
				id="floating_password"
				name="password"
				label="Password"
				on:keydown={() => (errorStatus.password.status = false)}
				color={errorStatus.password.status ? 'red' : 'base'}
				type={showPassword ? 'text' : 'password'}
				class="mb-4 !text-white"
				bind:value={password}
			/>
			{#if errorStatus.password.status}
				<Helper class="mb-5 -mt-4" color="red">{errorStatus.password.msg}</Helper>
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="absolute top-0 right-0" on:click={() => (showPassword = !showPassword)}>
				{#if showPassword}
					<Icon icon="bi:eye-fill" color="white" width="24" />
				{:else}
					<Icon icon="bi:eye-slash-fill" color="gray" width="24" />
				{/if}
			</div>
		</div>
		<div class="relative">
			<!-- confirm password field -->
			<FloatingLabelInput
				id="password_confirm"
				name="Password Confirm"
				label="Password Confirm"
				on:keydown={() => (errorStatus.confirm.status = false)}
				color={errorStatus.confirm.status ? 'red' : 'base'}
				type={showPassword ? 'text' : 'password'}
				class="mb-4 !text-white"
				bind:value={confirmPassword}
			/>
			{#if errorStatus.confirm.status}
				<Helper class="mb-5" color="red">{errorStatus.confirm.msg}</Helper>
			{/if}
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="absolute top-0 right-0" on:click={() => (showPassword = !showPassword)}>
				{#if showPassword}
					<Icon icon="bi:eye-fill" color="white" width="24" />
				{:else}
					<Icon icon="bi:eye-slash-fill" color="gray" width="24" />
				{/if}
			</div>
		</div>
		<div class="buttons">
			<Button on:click={signup} color="light" class="mt-4">Sign Up</Button>
		</div>
	</div>
</div>

<style>
	.hide {
		transition: 0s;
		opacity: 0;
	}
</style>
