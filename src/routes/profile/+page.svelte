<script lang="ts">
	import type { PageData } from './$types';
	import AddUser from './AddUser.svelte';
	import ChangePassword from './ChangePassword.svelte';
	import ShowUsers from './ShowUsers.svelte';
	import type { Roles } from '@src/auth/types';
	export let data: PageData;
	console.log(data);

	let options: { [key: number]: { role: Roles | undefined; option: any; label: string } } = {
		0: {
			role: 'admin',
			option: AddUser,
			label: 'Add user'
		},
		1: {
			role: 'admin',
			option: ShowUsers,
			label: 'Show users'
		},
		2: {
			role: undefined,
			option: ChangePassword,
			label: 'Change password'
		}
	};

	let option: number | string = 2;
</script>

<div class="body max-md:flex-col gap-[20px] max-md:gap-2 overflow-auto">
	<div class="options bg-gray-800 md:px-[30px] p-[20px] min-w-[320px]">
		<p class="text-white text-center mb-2">User: {data.user.username}</p>
		<!-- <p class="text-white text-center">Auth method {data.user.authMethod}</p> -->
		{#each Object.entries(options) as [key, _option]}
			{#if _option.role == undefined || _option.role == data.user.role}
				<div class:active={option == key} on:click={() => (option = key)}>{_option.label}</div>
			{/if}
		{/each}
	</div>
	<div class="flex-grow bg-gray-800 flex items-center justify-center">
		{#if option == 0}
			<svelte:component this={options[option].option} {data} bind:option />
		{:else}
			<svelte:component this={options[option].option} {data} />
		{/if}
	</div>
</div>

<style>
	.body {
		display: flex;
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: #979797;

		padding: 10px;
	}
	.body > div {
		border-radius: 10px;
	}

	.options div {
		cursor: pointer;
		border: #d2d2d2 1px solid;
		padding: 10px 20px;
		margin-bottom: 20px;
		background: white;
		border-radius: 5px;
		text-align: center;
	}
	.options div:hover,
	.options div.active {
		box-shadow: 0px 0px 10px 3px rgb(255 255 255 / 70%);
	}
</style>
