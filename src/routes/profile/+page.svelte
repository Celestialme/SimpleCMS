<script lang="ts">
	import type { PageData } from './$types';
	import AddUser from './AddUser.svelte';
	import ChangePassword from './ChangePassword.svelte';

	export let data: PageData;
	console.log(data);
</script>

<div class="body">
	<p class="text-white text-center">Hello {data.user.username}</p>
	<p class="text-white text-center">Auth method {data.user.authMethod}</p>
	{#if data.user.role == 'admin'}
		<AddUser {data} />
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
