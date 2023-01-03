<script lang="ts">
	import Icon from '@iconify/svelte';
	import env from '@root/env';
	import axios from 'axios';
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
			errorStatus.email.msg = 'Please type valid Email';
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

<div class:hide={!show} class="w-full opacity-100 duration-[2000ms]">
	<div class="mx-auto mt-[15%] mb-[5%] w-full  p-4 lg:w-1/2">
		<div class="mb-8 flex flex-row gap-2">
			<CMSLogo className="w-10" fill="red" />

			<h1 class="text-2xl font-bold text-white lg:text-3xl">SimpleCMS Sign Up</h1>
		</div>

		<form>
			<!-- Email field -->
			<div class="group relative z-0 mb-6 w-full">
				<input
					bind:value={email}
					on:keydown={() => (errorStatus.email.status = false)}
					color={errorStatus.email.status ? 'red' : 'base'}
					type="email"
					name="floating_email"
					class="peer block w-full appearance-none rounded-none border-0 border-b-2 border-gray-300 !bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
					placeholder=" "
					required
				/>
				<label
					for="floating_email"
					class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
					>Email Address</label
				>

				{#if errorStatus.email.status}
					<div class="absolute top-11 left-0 text-xs text-red-500">{errorStatus.email.msg}</div>
				{/if}
			</div>

			<!-- Password field -->
			<!-- TODO  - not working error 'type' attribute cannot be dynamic if input uses two-way binding 
					type={showPassword ? 'text' : 'password'}
				-->
			<div class="group relative z-0 mb-6 w-full">
				<input
					bind:value={password}
					on:keydown={() => (errorStatus.password.status = false)}
					color={errorStatus.password.status ? 'red' : 'base'}
					type="password"
					name="floating_password"
					autocomplete="current-password"
					id="floating_password"
					class="peer block w-full appearance-none rounded-none border-0 border-b-2 border-gray-300 !bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
					placeholder=" "
					required
				/>
				<label
					for="floating_password"
					class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
					>Password</label
				>

				<div class="absolute top-2 right-2" on:click={() => (showPassword = !showPassword)}>
					{#if showPassword}
						<Icon icon="bi:eye-fill" color="base" width="24" />
					{:else}
						<Icon icon="bi:eye-slash-fill" color="gray" width="24" />
					{/if}
				</div>

				{#if errorStatus.password.status}
					<div class="absolute top-11 left-0 text-xs text-red-500">{errorStatus.password.msg}</div>
				{/if}
			</div>

			<!-- Password Confirm -->
			<!-- TODO  - not working error 'type' attribute cannot be dynamic if input uses two-way binding 
					type={showPassword ? 'text' : 'password'}
				-->
			<div class="group relative z-0 mb-6 w-full">
				<input
					bind:value={confirmPassword}
					on:keydown={() => (errorStatus.confirm.status = false)}
					color={errorStatus.confirm.status ? 'red' : 'base'}
					type="password"
					name="repeat_password"
					id="floating_repeat_password"
					class="peer block w-full appearance-none rounded-none border-0 border-b-2 border-gray-300 !bg-transparent py-2.5 px-0 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
					placeholder=" "
					required
				/>
				<label
					for="floating_repeat_password"
					class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
					>Confirm Password</label
				>

				<div class="absolute top-2 right-2" on:click={() => (showPassword = !showPassword)}>
					{#if showPassword}
						<Icon icon="bi:eye-fill" color="base" width="24" />
					{:else}
						<Icon icon="bi:eye-slash-fill" color="gray" width="24" />
					{/if}
				</div>

				{#if errorStatus.confirm.status}
					<div class="absolute top-11 left-0 text-xs text-red-500">{errorStatus.confirm.msg}</div>
				{/if}
			</div>
		</form>

		<!-- TODO Skeleton Css not working -->
		<button on:click={signup} class="btn btn-sm mt-4 rounded-md  bg-white text-black"
			>Sign Up</button
		>
	</div>
</div>

<style>
	.hide {
		transition: 0s;
		opacity: 0;
	}
</style>
