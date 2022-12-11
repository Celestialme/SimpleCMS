<script lang="ts">
	import Icon from '@iconify/svelte';
	import env from '@root/env';
	import axios from 'axios';
	import { Button, FloatingLabelInput } from 'flowbite-svelte';
	import { credentials } from '@src/stores/store';
	import CMSLogo from './icons/Logo.svelte';
	import { goto } from '$app/navigation';
	export let show: boolean = false;
	let showPassword: boolean = false;
	let forgot: boolean = false;
	let email = '';
	let password = '';
	let form: HTMLDivElement;
	async function signin() {
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

<div class:hide={!show} class="w-full duration-[2000ms] opacity-100">
	{#if !forgot}
		<div bind:this={form} class="w-full lg:w-1/2 mx-auto p-4  mt-[15%] mb-[5%]">
			<div class="flex flex-row gap-2 mb-8">
				<CMSLogo className="w-10" fill="red" />

				<h1 class="text-3xl font-bold">SimpleCMS - Sign In</h1>
			</div>

			<!-- Email field -->

			<FloatingLabelInput
				id="floating_email"
				name="email"
				type="text"
				color="base"
				label="Email Address"
				class="mb-10"
				bind:value={email}
			/>

			<div class="relative">
				<!-- password field -->
				<FloatingLabelInput
					id="floating_password"
					name="password"
					label="Password"
					color="base"
					type={showPassword ? 'text' : 'password'}
					autocomplete="current-password"
					class="mb-4"
					bind:value={password}
				/>
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<div class="absolute top-0 right-0" on:click={() => (showPassword = !showPassword)}>
					{#if showPassword}
						<Icon icon="bi:eye-fill" color="base" width="24" />
					{:else}
						<Icon icon="bi:eye-slash-fill" color="gray" width="24" />
					{/if}
				</div>
			</div>
			<div class="buttons">
				<Button on:click={signin} color="dark" class="mt-4">Sign In</Button>

				<Button on:click={() => (forgot = true)} outline color="light" class="mt-4 ml-4"
					>Forgotten Password</Button
				>
			</div>
		</div>
	{:else}
		<form class="w-full lg:w-1/2 mx-auto p-4">
			<div class="flex flex-row gap-2 mb-8">
				<CMSLogo className="w-10" fill="red" />
				<h1 class="text-3xl font-bold">Forgotten Password</h1>
			</div>

			<FloatingLabelInput
				id="floating_email"
				name="Email Address"
				type="text"
				label="Email Address"
				class="mb-4"
				bind:value={email}
			/>

			<Button type="submit" color="dark" class="mt-4">Send Password Reset Email</Button>
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
