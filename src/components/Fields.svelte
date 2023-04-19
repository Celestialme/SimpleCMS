<script lang="ts">
	import { collection } from '@src/collections';
	import { collectionValue } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	export let fields: typeof $collection.fields | undefined = undefined;
	let asAny = (value: any) => value;
	export let root = true; // if Fields is not part of any widget.
	export let fieldsData = {};
	$: if (root) $collectionValue = fieldsData;
</script>

<div class="container">
	{#each fields || $collection.fields as field, index}
		{#if field.widget}
			{#key $collection}
				<div>
					<p>{field.label}</p>
					<svelte:component this={asAny(field.widget)} field={asAny(field)} bind:fieldData={fieldsData[getFieldName(field)]} {...$$props} />
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
