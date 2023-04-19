<script lang="ts">
	import type { FieldType } from './';

	import Input from '@src/components/system/inputs/Input.svelte';
	import { mode, entryValue } from '@src/stores/store';
	import { getFieldName } from '@src/utils/utils';
	export let field: FieldType | undefined;
	let fieldName = getFieldName(field);

	let _data: { [key: string]: string } = $mode == 'create' ? {} : $entryValue[fieldName];
	export const fieldData = async () => _data;
</script>

<Input type="text" bind:value={_data['en']} />
