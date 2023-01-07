<script lang="ts">
	import Icon from '@iconify/svelte';
	import env from '@root/env';
	import axios from 'axios';
	import { credentials } from '@src/stores/store';
	import CMSLogo from './icons/Logo.svelte';
	import { goto } from '$app/navigation';

	// typesafe-i18n
	import LL from '../../../i18n/i18n-svelte';

	export let show: boolean = false;

	let showPassword: boolean = false;
	let forgot: boolean = false;
	let email = '';
	let password = '';
	let errorStatus = {
		email: { status: false, msg: '' },
		confirm: { status: false, msg: '' },
		password: { status: false, msg: '' }
	};
	let form: HTMLDivElement;

	async function signin() {
		email = email.trim();
		let emailRegex = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
		let error = false;

		if (!emailRegex.test(email)) {
			errorStatus.email.status = true;
			errorStatus.email.msg = $LL.LOGIN_emailmsg_valid();
			error = true;
		}
		if (!/\.\w+$/.test(email)) {
			errorStatus.email.msg = $LL.LOGIN_emailmsg_domain();
		}
		if (!email.includes('@')) {
			errorStatus.email.msg = $LL.LOGIN_emailmsg_at();
		}
		if (!email) {
			errorStatus.email.msg = $LL.LOGIN_emailmsg_empty();
		}
		if (!password) {
			errorStatus.password.msg = $LL.LOGIN_passwordmsg_empty();
			errorStatus.password.status = true;
			error = true;
		}

		let resp = (
			await axios.post(
				`${env.API}/signin`,
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
		} else {
			form.classList.add('wiggle');
			setTimeout(() => form.classList.remove('wiggle'), 300);
		}
	}
</script>

<div class:hide={!show} class="w-full opacity-100 duration-[2000ms]">
	{#if !forgot}
		<div bind:this={form} class="mx-auto mt-[15%] mb-[5%] w-full p-4 lg:w-1/2">
			<div class="mb-8 flex flex-row gap-2">
				<CMSLogo className="w-10" fill="red" />
				<h1 class="text-2xl font-bold text-black lg:text-3xl">
					{env.SiteNAME}
					{$LL.LOGIN_SignIn()}
				</h1>
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
						class="peer block w-full appearance-none rounded-none border-0 border-b-2 border-gray-300 !bg-transparent py-2.5 px-0 text-sm !text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
						placeholder=" "
						required
					/>
					<label
						for="floating_email"
						class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
						>{$LL.LOGIN_EmailAddress()}</label
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
					{#if showPassword}
						<input
							bind:value={password}
							on:keydown={() => (errorStatus.password.status = false)}
							color={errorStatus.password.status ? 'red' : 'base'}
							type="text"
							name="floating_password"
							autocomplete="current-password"
							id="floating_password"
							class="peer block w-full appearance-none rounded-none border-0 border-b-2 border-gray-300 !bg-transparent py-2.5 px-0 text-sm !text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
							placeholder=" "
							required
						/>
					{:else}
						<input
							bind:value={password}
							on:keydown={() => (errorStatus.password.status = false)}
							color={errorStatus.password.status ? 'red' : 'base'}
							type="password"
							name="floating_password"
							autocomplete="current-password"
							id="floating_password"
							class="peer block w-full appearance-none rounded-none border-0 border-b-2 border-gray-300 !bg-transparent py-2.5 px-0 text-sm !text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
							placeholder=" "
							required
						/>
					{/if}
					<label
						for="floating_password"
						class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
						>{$LL.LOGIN_Password()}</label
					>

					<div class="absolute top-2 right-2" on:click={() => (showPassword = !showPassword)}>
						{#if showPassword}
							<Icon icon="bi:eye-fill" color="base" width="24" />
						{:else}
							<Icon icon="bi:eye-slash-fill" color="gray" width="24" />
						{/if}
					</div>

					{#if errorStatus.password.status}
						<div class="absolute top-11 left-0 text-xs text-red-500">
							{errorStatus.password.msg}
						</div>
					{/if}
				</div>
			</form>

			<div class="buttons">
				<button on:click={signin} class="btn btn-sm  mt-4 rounded-lg border bg-gray-700 text-white "
					>{$LL.LOGIN_SignIn()}</button
				>

				<button
					on:click={() => (forgot = true)}
					class="btn btn-sm  mt-4 ml-4 rounded-lg border border-gray-700  text-gray-700 "
					>{$LL.LOGIN_ForgottenPassword()}</button
				>
			</div>
		</div>
	{:else}
		<form class="mx-auto w-full p-4 lg:w-1/2">
			<div class="mb-8 flex flex-row gap-2">
				<CMSLogo className="w-10" fill="red" />
				<h1 class="text-3xl font-bold text-black ">{$LL.LOGIN_ForgottenPassword()}</h1>
			</div>

			<!-- Email field -->
			<!-- TODO Error messge not working as it need to be FORGOT EMAIL -->
			<div class="group relative z-0 mb-6 w-full">
				<input
					bind:value={email}
					on:keydown={() => (errorStatus.email.status = false)}
					color={errorStatus.email.status ? 'red' : 'base'}
					type="email"
					name="floating_email"
					class="peer block w-full appearance-none rounded-none border-0 border-b-2 border-gray-300 !bg-transparent py-2.5 px-0 text-sm !text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:text-white dark:focus:border-blue-500"
					placeholder=" "
					required
				/>
				<label
					for="floating_email"
					class="absolute top-3 -z-10 origin-[0] -translate-y-6 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:left-0 peer-focus:-translate-y-6 peer-focus:scale-75 peer-focus:text-blue-600 dark:text-gray-400 peer-focus:dark:text-blue-500"
					>{$LL.LOGIN_EmailAddress()}</label
				>

				{#if errorStatus.email.status}
					<div class="absolute top-11 left-0 text-xs text-red-500">{errorStatus.email.msg}</div>
				{/if}
			</div>

			<!-- TODO Skeleton CSS not working -->
			<button
				type="submit"
				class="btn btn-sm text-whitebtn-base mt-4 rounded-lg border bg-gray-600 text-white"
				>{$LL.LOGIN_SendResetMail()}</button
			>
		</form>
	{/if}
</div>

<style>
	.hide {
		transition: 0s;
		opacity: 0;
	}
	:global(.wiggle) {
		animation: wiggle 0.3s forwards;
	}
	@keyframes wiggle {
		0% {
			transform: translateX(0);
		}
		25% {
			transform: translateX(150px);
		}
		50% {
			transform: translateX(-75px);
		}
		75% {
			transform: translateX(200px);
		}
		100% {
			transform: translateX(0px);
		}
	}
</style>
