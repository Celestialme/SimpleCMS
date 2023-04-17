<script lang="ts">
	import axios from 'axios';
	import Button from './system/buttons/Button.svelte';
	import { collection, collectionValue, mode } from '@src/stores/store';
	import { config, obj2formData } from '@src/utils/utils';
	async function saveData() {
		let formData = obj2formData($collectionValue);
		await axios.post(`/api/${$collection.name}`, formData, config);
		mode.set('view');
	}
</script>

<div class="container">
	{#if $mode == 'view'}
		<Button on:click={() => mode.set('create')}>Create</Button>
	{:else if ['edit', 'create'].includes($mode)}
		<Button on:click={saveData}>Save</Button>
	{/if}
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: start;
		flex-direction: column;
		width: 200px;
		height: 100vh;
		background-color: #242734;
	}
</style>
