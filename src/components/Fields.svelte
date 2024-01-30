<script lang="ts">
	import { collectionValue } from '@src/stores/store';
	import { collection } from '@src/stores/load';
	import { asAny, getFieldName } from '@src/utils/utils';
	export let fields: typeof $collection.fields | undefined = undefined;

	export let root = true; // if Fields is not part of any widget.
	export let fieldsData = {};
	export let customData = {};
	$: if (root) $collectionValue = fieldsData;
	console.log(customData);
</script>

<div class="wrapper">
	{#each fields || $collection.fields as field, index}
		{#if field.widget}
			{#key $collection}
				<div
					class=" mx-auto text-center {!field.width ? 'w-full' : 'max-md:!w-full'}"
					style={'min-width:min(300px,100%);' + field.width ? `width:${Math.floor(100 / (field?.width || 1))}%` : ''}
				>
					<div class="px-[5px] text-start inline-block max-w-full">
						<p>{field.label}</p>
						<svelte:component
							this={asAny(field.widget.type)}
							field={asAny(field)}
							bind:WidgetData={fieldsData[getFieldName(field)]}
							value={customData[getFieldName(field)]}
							{...$$props}
						/>
					</div>
				</div>
			{/key}
		{/if}
	{/each}
</div>

<style>
	.wrapper {
		overflow: auto;
		max-height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		/* flex-direction: column; */
		flex-wrap: wrap;
		width: 100%;
		height: 100%;
	}
</style>
