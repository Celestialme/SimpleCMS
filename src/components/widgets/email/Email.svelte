<script lang="ts">
	import type { FieldType } from './';

	import { mode, entryData } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';

	export let field: FieldType | undefined;
	//console.log('field', field);

	let fieldName = getFieldName(field);
	//console.log('fieldName', fieldName);

	export let value = $entryData[fieldName];

	let _data = $mode == 'create' ? {} : value;

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
	bind:value={_data['en']}
	on:input={checkRequired}
	name={field?.db_fieldName}
	id={field?.db_fieldName}
	placeholder={field?.placeholder && field?.placeholder !== '' ? field?.placeholder : field?.db_fieldName}
	class="input"
/>
