<script lang="ts">
	import { PUBLIC_CONTENT_LANGUAGE } from '$env/static/public';
	import type { FieldType } from './';

	import Input from '@src/components/system/inputs/Input.svelte';
	import { contentLanguage } from '@src/stores/load';
	import { mode, entryData } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	export let field: FieldType | undefined;
	let fieldName = getFieldName(field);
	export let value = $entryData[fieldName];
	console.log(value);
	let _data = $mode == 'create' ? {} : value;
	let _language = field?.translated ? $contentLanguage : PUBLIC_CONTENT_LANGUAGE;
	console.log(_data, $contentLanguage);
	console.log($mode);
	export const WidgetData = async () => _data;
</script>

<Input type="text" bind:value={_data[_language]} />
