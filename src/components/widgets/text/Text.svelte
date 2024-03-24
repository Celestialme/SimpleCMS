<script lang="ts">
	import publicConfig from '@root/config/public';

	import type { FieldType } from '.';

	import Input from '@src/components/system/inputs/Input.svelte';
	import { contentLanguage } from '@src/stores/load';
	import { mode, entryData } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	import { createEventDispatcher } from 'svelte';
	export let field: FieldType;
	let fieldName = getFieldName(field);
	export let value = $entryData[fieldName] || {};
	const dispatch = createEventDispatcher();
	let _data = $mode == 'create' ? {} : value;
	$: dispatch('change', _data);
	$: _language = field?.translated ? $contentLanguage : publicConfig.DEFAULT_CONTENT_LANGUAGE;

	export const WidgetData = async () => _data;
</script>

<Input type="text" bind:value={_data[_language]} />
