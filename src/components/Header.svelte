<script lang="ts">
	import { collection } from '@src/stores/load';
	import MultiButton from './system/buttons/MultiButton.svelte';
	import { mode } from '@src/stores/store';
	import DeleteIcon from './system/icons/DeleteIcon.svelte';
</script>

<div class="wrapper">
	<div class="collection">
		{$collection.name}
	</div>
	{#if $mode != 'edit'}
		<MultiButton />
	{:else}
		<button on:click={() => mode.set('view')}>
			<DeleteIcon />
		</button>
	{/if}
</div>

<style>
	.collection {
		width: 200px;
		font-size: 22px;
	}

	.wrapper {
		position: relative;
		height: 50px;
		width: 100%;
		min-width: 200px;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 1;
		background-color: #242734;
		color: white;
		margin-bottom: 10px;
		padding: 10px;
	}
</style>
