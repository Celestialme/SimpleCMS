<script lang="ts">
	import { collection, collectionValue } from '@src/stores/store';
	collection.subscribe((value) => {
		$collectionValue = {};
	});
	export let fields: typeof $collection.fields | undefined = undefined;
</script>

<div class="container">
	{#each fields || $collection.fields as field, index}
		{#if field.widget}
			{#key $collection}
				<div>
					<p>{field.label}</p>
					<svelte:component this={field.widget} {field} bind:fieldValue={$collectionValue[field.label]} />
				</div>
			{/key}
		{/if}
	{/each}
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
</style>
