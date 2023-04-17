<script lang="ts">
	import Input from '@src/components/system/inputs/Input.svelte';
	import { mode } from '@src/stores/store';
	import { entryValue } from '@src/stores/widgetStore';
	export let field: any;
	export let fieldValue: { [key: string]: string } = $mode == 'create' ? {} : $entryValue[field.label];
</script>

<Input type="text" bind:value={fieldValue['en']} />
