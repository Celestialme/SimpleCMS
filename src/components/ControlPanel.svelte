<script lang="ts">
	import { collection } from '@src/stores/load';
	import Button from './system/buttons/Button.svelte';
	import { collectionValue, mode, deleteEntry } from '@src/stores/store';
	import { saveFormData } from '@src/utils/utils';
	import { page } from '$app/stores';
	import type { User } from '@src/collections/Auth';
	async function saveData() {
		await saveFormData({ data: $collectionValue });
		mode.set('view');
	}
	let user: User = $page.data.user;
</script>

<div class="container">
	{#if $collection.permissions?.[user.role]?.write != false}
		{#if $mode == 'view'}
			<Button on:click={() => mode.set('create')}>Create</Button>
		{:else if ['edit', 'create'].includes($mode)}
			<Button on:click={saveData}>Save</Button>
		{:else if $mode == 'delete'}
			<Button on:click={$deleteEntry}>Delete</Button>
		{/if}
	{/if}
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: flex-start;
		flex-direction: column;
		width: 200px;
		height: 100vh;
		background-color: #242734;
	}
</style>
