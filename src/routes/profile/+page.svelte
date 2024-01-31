<script lang="ts">
	import type { PageData } from './$types';
	import AddUser from './AddUser.svelte';
	import ChangePassword from './ChangePassword.svelte';
	import ShowUsers from './ShowUsers.svelte';

	export let data: PageData;
	console.log(data);

	let options = {
		0: {
			role: undefined,
			option: ChangePassword
		},
		1: {
			role: 'admin',
			option: AddUser
		},
		2: {
			role: 'admin',
			option: ShowUsers
		}
	};

	let option = 0;
</script>

<div class="body max-md:flex-col gap-[50px] max-md:gap-2">
	<div class="options bg-gray-800 md:px-[30px] p-[20px] min-w-[320px]">
		<p class="text-white text-center mb-2">User: {data.user.username}</p>
		<!-- <p class="text-white text-center">Auth method {data.user.authMethod}</p> -->
		<div on:click={() => (option = 1)}>Add user</div>
		<div on:click={() => (option = 2)}>Show users</div>
		<div on:click={() => (option = 0)}>Change password</div>
	</div>
	<div class="flex-grow bg-gray-800 flex items-center justify-center">
		<svelte:component this={options[option].option} {data} />
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
	.options div:hover {
		box-shadow: 0px 0px 10px 3px rgb(255 255 255 / 70%);
	}
</style>
