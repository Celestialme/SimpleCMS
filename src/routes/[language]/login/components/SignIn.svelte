<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { credentials } from '@src/stores/load';
	import SigninIcon from './icons/SigninIcon.svelte';
	export let active: undefined | 0 | 1 = undefined;
	import LL from '@src/i18n/i18n-svelte';
	import Input from '@src/components/system/inputs/Input.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	let form: HTMLDivElement;
	let email = '';
	let password = '';

	async function signup() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ email, password, authType: 'signIn' },
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

<section
	on:click
	on:pointerenter
	class="relative flex items-center hover"
	class:active={active == 0}
	class:inactive={active !== undefined && active !== 0}
	class:hover={active == undefined || active == 1}
>
	<div bind:this={form} class="flex flex-col items-center w-full" class:hide={active != 0}>
		<Input type="text" bind:value={email} label="email" />
		<Input type="password" bind:value={password} label="password" />
		<Button btnClass="mt-10" on:click={signup}>{$LL.LOGIN_SignIn()}</Button>
	</div>
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
