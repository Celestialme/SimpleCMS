<script lang="ts">
	import Fields from '@src/components/Fields.svelte';
	import { currentChild, type FieldType } from '.';
	import { extractData, getFieldName } from '@src/utils/utils';
	import ListNode from './ListNode.svelte';
	import { translationProgress } from '@src/stores/store.svelte';
	import { saveFunction } from '@src/stores/load';
	import { mode, entryData } from '@src/stores/store.svelte';
	export let field: FieldType;
	let fieldName = getFieldName(field);
	translationProgress.value.show = false;
	export let value = entryData.value[fieldName];
	export const WidgetData = async () => _data;
	let MENU_CONTAINER: HTMLUListElement;
	let showFields = false;
	let depth = 0;
	let _data: { [key: string]: any; children: any[] } = mode.value == 'create' ? null : value;
	let fieldsData = {};
	let saveMode = mode.value;

	async function saveLayer() {
		let _fieldsData = await extractData(fieldsData);

		if (!_data) {
			_data = { ..._fieldsData, children: [] };
		} else if (mode.value == 'edit') {
			for (let key in _fieldsData) {
				$currentChild[key] = _fieldsData[key];
			}
		} else if (mode.value == 'create' && $currentChild.children) {
			$currentChild.children.push({ ..._fieldsData, children: [] });
		}

		_data = _data;
		showFields = false;
		fieldsData = {};
		mode.set(saveMode);
		depth = 0;
		$saveFunction.reset();
	}
</script>

{#if !_data || showFields}
	{#key depth}
		<Fields fields={field.fields[depth]} root={false} bind:fieldsData customData={$currentChild} />
	{/key}
	{(($saveFunction.fn = saveLayer), '')}
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
