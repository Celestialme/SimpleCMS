<script lang="ts">
	import publicConfig from '@root/config/public';

	import type { FieldType } from '.';
	import Input from '@src/components/system/inputs/Input.svelte';
	import { contentLanguage } from '@src/stores/load';
	import { mode, entryData, translationProgress } from '@src/stores/store';
	import { updateTranslationProgress, getFieldName } from '@src/utils/utils';

	export let field: FieldType;
	let fieldName = getFieldName(field);
	export let value = $entryData[fieldName] || {};

	let _data = $mode == 'create' ? {} : value;

	$: _language = field?.translated ? $contentLanguage : publicConfig.DEFAULT_CONTENT_LANGUAGE;

	$: updateTranslationProgress(_data, field);
	export const WidgetData = async () => _data;
</script>

<Input type="text" bind:value={_data[_language]} />
