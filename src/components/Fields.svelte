<script lang="ts">
	import { collectionValue, entryData } from '@src/stores/store';
	import { collection, collections } from '@src/stores/load';
	import { asAny, getFieldName } from '@src/utils/utils';
	import SquareIcon from './system/icons/SquareIcon.svelte';
	import CheckBox from './system/buttons/CheckBox.svelte';
	export let fields: typeof $collection.fields | undefined = undefined;

	export let root = true; // if Fields is not part of any widget.
	export let fieldsData = {};
	export let customData = {};
	let links: { [key: string]: boolean } = $entryData['_links'] || {};

	$: if (root)
		$collectionValue = {
			...fieldsData,
			_links: () => links,
			_is_link: () => $entryData['_is_link'] || false,
			_linked_collection: () => $entryData['_linked_collection'] || null
		};
	let linked_collection = $collections[$entryData['_linked_collection']];
</script>

<div class="wrapper relative">
	{#each $entryData['_is_link'] ? linked_collection?.links : $collection?.links || [] as link}
		<div class="border border-solid border-gray-300 flex items-center p-2 gap-2 rounded-md">
			<CheckBox icon={SquareIcon} bind:checked={links[link]} />
			{link}
		</div>
	{/each}
	{#each fields || $collection.fields as field, index}
		{#if field.widget}
			{#key $collection}
				<div
					class=" mx-auto text-center {!field.width ? 'w-full' : 'max-md:!w-full'}"
					style={'min-width:min(300px,100%);' + field.width
						? `width:${Math.floor(100 * (field?.width || 1))}%`
						: ''}
				>
					<div class="px-[5px] text-start inline-block max-w-full">
						<p>{field.label}</p>
						{#await import(`@src/components/widgets/${field.widget.Name}/${field.widget.Name}.svelte`) then widget}
							<svelte:component
								this={widget.default}
								field={asAny(field)}
								bind:WidgetData={fieldsData[getFieldName(field)]}
								value={customData[getFieldName(field)]}
								{...$$props}
							/>
						{/await}
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
