<script lang="ts">
	import publicConfig from '@root/config/public';

	import type { FieldType } from '.';
	import Input from '@src/components/system/inputs/Input.svelte';
	import { contentLanguage } from '@src/stores/store.svelte';
	import { updateTranslationProgress, getFieldName, get_date } from '@src/utils/utils';
	import { entryData, mode } from '@src/stores/store.svelte';
	import { track } from '@src/utils/reactivity.svelte';

	interface Props {
		field: FieldType;
		value?: any;
		WidgetData?: any;
	}

	let {
		field,
		value = entryData()[getFieldName(field)] || {},
		WidgetData = $bindable()
	}: Props = $props();

	let _data = $state(mode() == 'create' ? {} : value);

	let _language = $derived(
		field?.translated ? contentLanguage() : publicConfig.DEFAULT_CONTENT_LANGUAGE
	);

	track(
		() => updateTranslationProgress(_data, field),
		() => _data[_language]
	);

	WidgetData = async () => _data;

	$effect(() => {
		if (field.type == 'date') {
			!_data[_language] && (_data[_language] = get_date());
		}
	});
</script>

{#if ['text', 'email'].includes(field.type)}
	<Input type="text" bind:value={_data[_language]} />
{:else if field.type == 'date'}
	<input type="date" bind:value={_data[_language]} />
{/if}
