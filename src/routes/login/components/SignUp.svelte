<script lang="ts">
	import { goto } from '$app/navigation';
	import axios from 'axios';
	import { credentials } from '@src/stores/load';
	import SignupIcon from './icons/SignupIcon.svelte';
	export let active: undefined | 0 | 1 = undefined;
	import LL from '@src/i18n/i18n-svelte';
	import Input from '@src/components/system/inputs/Input.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	let email = '';
	let password = '';

	async function signup() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ email, password, authType: 'signUp' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;
		if (resp.status == 200) {
			credentials.set(resp);
			goto('/');
		}
	}
</script>

<section
	on:click
	on:pointerenter
	class="relative flex items-center hover"
	class:active={active == 1}
	class:inactive={active !== undefined && active !== 1}
	class:hover={active == undefined || active == 0}
>
	<div class="flex flex-col items-center justify-center w-full" class:hide={active != 1}>
		<Input type="text" bind:value={email} label="email" labelClass="text-white" />
		<Input type="password" bind:value={password} label="password" labelClass="text-white" />
		<Button btnClass="mt-10" on:click={signup}>{$LL.LOGIN_SignUp()}</Button>
	</div>
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
