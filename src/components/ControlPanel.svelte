<script lang="ts">
	import Button from './system/buttons/Button.svelte';
	import { collectionValue, mode } from '@src/stores/store';
	import { saveFormData } from '@src/utils/utils';
	async function saveData() {
		await saveFormData($collectionValue);
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
