<script lang="ts">
	import Fields from '@src/components/Fields.svelte';
	import { currentChild, type FieldType } from '.';
	import { extractData, getFieldName } from '@src/utils/utils';
	import Button from '@src/components/system/buttons/Button.svelte';
	import ListNode from './ListNode.svelte';
	import { entryData, mode } from '@src/stores/store';
	export let field: FieldType;
	let fieldName = getFieldName(field);
	export let value = $entryData[fieldName];
	export const WidgetData = async () => _data;
	let showFields = false;
	let depth = 0;
	let _data: { [key: string]: any; children: any[] } = $mode == 'create' ? null : value;
	let fieldsData = {};
	let saveMode = $mode;
	async function saveLayer() {
		if (!_data) {
			_data = { ...(await extractData(fieldsData)), children: [] };
		} else if ($mode == 'edit') {
			let _data = await extractData(fieldsData);
			for (let key in _data) {
				$currentChild[key] = _data[key];
			}
		} else if ($mode == 'create' && $currentChild.children) {
			$currentChild.children.push({ ...(await extractData(fieldsData)), children: [] });
		}
		_data = _data;
		console.log(_data);
		showFields = false;
		mode.set(saveMode);
		depth = 0;
	}
</script>

{#if !_data || showFields}
	{#key depth}
		{(fieldsData = {}) && ''}
		<Fields fields={field.menu[depth].fields} root={false} bind:fieldsData customData={$currentChild} />
	{/key}
	<Button on:click={saveLayer}>Save</Button>
{/if}
{#if _data && depth == 0}
	<ListNode self={_data} bind:depth bind:showFields maxDepth={field.menu.length} />
{/if}
