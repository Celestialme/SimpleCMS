<script lang="ts">
	import Fields from '@src/components/Fields.svelte';
	import { currentChild, type FieldType } from '.';
	import { extractData, getFieldName } from '@src/utils/fields';
	import ListNode from './ListNode.svelte';
	import { mode, entryData, saveFunction, translationProgress } from '@src/stores/store.svelte';
	import { track } from '@src/utils/reactivity.svelte';

	translationProgress().show = false;
	interface Props {
		field: FieldType;
		value?: any;
		WidgetData?: any;
	}

	let {
		field,
		value = entryData()[getFieldName(field)],
		WidgetData = $bindable()
	}: Props = $props();
	WidgetData = async () => _data;
	let MENU_CONTAINER = $state() as HTMLUListElement;
	let showFields = $state(false);
	let depth = $state(0);
	let _data: { [key: string]: any; children: any[] } = $state(mode() == 'create' ? null : value);
	let fieldsData = $state({});
	let saveMode = mode();

	async function saveLayer() {
		let _fieldsData = await extractData(fieldsData);

		if (!_data) {
			_data = { ..._fieldsData, children: [] };
		} else if (mode() == 'edit') {
			for (let key in _fieldsData) {
				currentChild()[key] = _fieldsData[key];
			}
		} else if (mode() == 'create' && currentChild().children) {
			currentChild().children.push({ ..._fieldsData, children: [] });
		}

		_data = _data;
		showFields = false;
		fieldsData = {};
		mode.set(saveMode);
		depth = 0;
		saveFunction().reset();
	}
	track(
		() => {
			if (!_data || showFields) saveFunction().fn = saveLayer;
		},
		() => [_data, showFields]
	);
</script>

{#if !_data || showFields}
	{#key depth}
		<Fields fields={field.fields[depth]} root={false} bind:fieldsData customData={currentChild()} />
	{/key}
{/if}
{#if _data}
	<ul bind:this={MENU_CONTAINER} class:hidden={depth != 0} class="children MENU_CONTAINER">
		<ListNode
			{MENU_CONTAINER}
			self={_data}
			bind:depth
			bind:showFields
			maxDepth={field.fields.length}
		/>
	</ul>
{/if}
