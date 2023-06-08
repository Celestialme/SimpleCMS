<script lang="ts">
	import type { FieldType } from './';

	import { mode, entryData } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';

	export let field: FieldType | undefined;
	console.log('field', field);

	let fieldName = getFieldName(field);
	//console.log('fieldName', fieldName);

	export let value = $entryData[fieldName];

	let _data = $mode == 'create' ? {} : value;

	export const WidgetData = async () => _data;
</script>

<input type="text" class="input variant-ghost-surface w-full" bind:value={_data['en']} />
