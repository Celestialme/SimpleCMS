<script lang="ts">
	import type { Schema } from '@src/collections/types';
	import collections from '@src/collections';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';

	export let value: Schema | string = '';
	export let theme: 'dark' | 'light' = 'dark';
	export let label = '';

	let _value =
		typeof value == 'string'
			? value
			: $collections.find((entry) => {
					return typeof value != 'string' && entry[1].name == value.name;
			  })?.[0] || 'null';
	$: value = _value;
</script>

<DropDown items={Object.keys(collections)} bind:selected={_value} label="Select Collection" />
