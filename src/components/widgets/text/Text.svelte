<script lang="ts">
	import Input from '@src/components/system/inputs/Input.svelte';
	import { entryValue } from '@src/stores/widgetStore';
	export let field: any;
	export let fieldValue: { [key: string]: string } = $entryValue[field.label];
	$: fieldValue = $entryValue[field.label];
</script>

<Input type="text" bind:value={fieldValue['en']} />
