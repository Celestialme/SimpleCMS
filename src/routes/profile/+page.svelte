<script lang="ts">
	import type { PageData } from './$types';
	import AddUser from './AddUser.svelte';
	import ChangePassword from './ChangePassword.svelte';

	export let data: PageData;
	console.log('data', data);
</script>

<div class="body">
	<p class="text-center text-white">Hello {data.user.username}</p>
	<p class="text-center text-white">Auth method {data.user.authMethod}</p>
	<p class="text-center text-white">email {data.user.email}</p>
	{#if data.user.role == 'admin'}
		<div class="border"><AddUser {data} /></div>
	{/if}
	<ChangePassword {data} />
</div>

<style>
	.body {
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: #242728;
	}
</style>
