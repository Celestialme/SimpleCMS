<script lang="ts">
	import type { FieldType } from '.';
	import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
	import { contentLanguage } from '@src/stores/store';
	import { mode, entryData } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';

	export let field: FieldType;

	let fieldName = getFieldName(field);
	export let value = $entryData[fieldName] || {};
	console.log('value: ', value);

	let _data = $mode == 'create' ? {} : value;
	let _language = field?.translated ? $contentLanguage : PUBLIC_CONTENT_LANGUAGES;

	export const WidgetData = async () => _data;

	let valid = true;

	function checkRequired() {
		if (field?.required && _data == '') {
			valid = false;
		} else {
			valid = true;
		}
	}
</script>

<input
	type="email"
	bind:value={_data[_language]}
	on:input={checkRequired}
	name={field?.db_fieldName}
	id={field?.db_fieldName}
	placeholder={field?.placeholder && field?.placeholder !== '' ? field?.placeholder : field?.db_fieldName}
	class="input"
/>
