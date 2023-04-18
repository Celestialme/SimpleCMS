<script lang="ts">
	import type { FieldType } from './';

	import Input from '@src/components/system/inputs/Input.svelte';
	import { mode } from '@src/stores/store';
	import { entryValue } from '@src/stores/widgetStore';
	export let field: FieldType | undefined;
	export let fieldValue: { [key: string]: string } = $mode == 'create' ? {} : $entryValue[field?.label as string];
</script>

<Input type="text" bind:value={fieldValue['en']} />
