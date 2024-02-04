<script lang="ts">
	import axios from 'axios';
	import Button from '../buttons/Button.svelte';
	import Collections from './Collections.svelte';
	import { goto } from '$app/navigation';
	import { drawerExpanded } from '@src/stores/store';
	async function signOut() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ authType: 'signOut' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;
		if (resp.status == 200) {
			goto(`/login`);
		}
	}
</script>

<div class="wrapper max-md:fixed max-md:w-0" class:max-md:!min-w-0={$drawerExpanded == false} class:drawerExpanded={$drawerExpanded}>
	<section class="h-[50px] mb-[10px] !p-[10px]">
		<button class="text-white" on:click={() => ($drawerExpanded = !$drawerExpanded)}
			><iconify-icon class="h-[14px]" icon="mingcute:menu-fill" width="24" /></button
		>
	</section>
	<section>
		<Collections />
	</section>
	<button class="text-white" on:click={() => goto(`/profile`)}>
		{#if $drawerExpanded}
			Profile
		{:else}
			<iconify-icon icon="bi:gear-fill"></iconify-icon>
		{/if}</button
	>
	<section class="mt-auto text-center">
		<Button class="max-w-full" on:click={signOut}>
			{#if $drawerExpanded}
				SignOut
			{:else}
				<iconify-icon icon="charm:sign-out"></iconify-icon>
			{/if}
		</Button>
	</section>
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #242734;
		min-width: 60px;
		overflow-x: hidden;
		transition: min-width 0.2s ease-out;
		z-index: 100;
	}
	.drawerExpanded {
		display: flex !important;
		min-width: 240px;
	}
	section {
		width: 100%;
		padding: 0 4px;
	}
</style>
