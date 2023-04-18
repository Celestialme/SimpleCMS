<script lang="ts">
	import { collectionValue } from '@src/stores/store';
	import { collection } from '@src/stores/load';
	collection.subscribe((value) => {
		$collectionValue = {};
	});
	export let fields: typeof $collection.fields | undefined = undefined;
	let asAny = (value: any) => value;
</script>

<div class="container">
	{#each fields || $collection.fields as field, index}
		{#if field.widget}
			{#key $collection}
				<div>
					<p>{field.label}</p>
					<svelte:component this={asAny(field.widget)} field={asAny(field)} bind:fieldValue={$collectionValue[field.label]} />
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
