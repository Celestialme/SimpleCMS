<script lang="ts">
	import SquareIcon from './system/icons/SquareIcon.svelte';
	import CheckBox from './system/buttons/CheckBox.svelte';
	import { collections, collection, entryData, collectionValue } from '@src/stores/store.svelte';
	import { track } from '@src/utils/reactivity.svelte';
	import { getFieldName } from '@src/utils/fields';

	interface Props {
		fields?: typeof collection.value.fields | undefined;
		root?: boolean;
		fieldsData?: any;
		customData?: any;
		value?: any;
	}

	let {
		fields = undefined,
		root = true,
		fieldsData = $bindable(),
		customData = {},
		...restProps
	}: Props = $props();
	let links: { [key: string]: boolean } = $state(entryData()['_links'] || {});
	fieldsData = {};
	track(
		() =>
			root &&
			collectionValue.update((old_value) => {
				return {
					...old_value,
					...fieldsData,
					_links: () => links,
					_is_link: () => entryData()['_is_link'] || false,
					_linked_collection: () => entryData()['_linked_collection'] || null
				};
			}),
		() => [root, $state.snapshot(fieldsData)]
	);
	let linked_collection = collections()[entryData()['_linked_collection']];
</script>

<div class="wrapper relative">
	<div
		class="flex flex-wrap gap-2 w-full pb-[10px] mb-[15px] shadow-[1px_2px_20px_0px_#00000061] empty:hidden"
	>
		{#each entryData()['_is_link'] ? linked_collection?.links : collection()?.links || [] as link}
			<div
				class="min-w-[150px] border border-solid border-gray-300 flex items-center p-2 gap-2 rounded-md"
			>
				<CheckBox icon={SquareIcon} bind:checked={links[link]} />
				{collections()[link].label || link}
			</div>
		{/each}
	</div>
	{#each fields || collection().fields as field, index}
		{#if field.widgetName}
			{#key collection()}
				<div
					class=" mx-auto text-center {!field.width ? 'w-full' : 'max-md:!w-full'}"
					style={'min-width:min(300px,100%);' + field.width
						? `width:${Math.floor(100 * (field?.width || 1))}%`
						: ''}
				>
					<div class="px-[5px] text-start inline-block max-w-full">
						<p>{field.label}</p>
						{#await import(`@src/components/widgets/${field.widgetName}/${field.widgetName}.svelte`) then { default: Widget }}
							<Widget
								field={field as any}
								bind:WidgetData={fieldsData[getFieldName(field)]}
								value={customData[getFieldName(field)]}
								{...restProps}
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
