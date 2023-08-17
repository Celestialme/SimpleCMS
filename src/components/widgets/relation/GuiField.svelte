<script lang="ts">
	import type { Schema } from '@src/collections/types';
	import collections from '@src/collections';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';

	export let value: Schema | string = '';

	let _value =
		typeof value == 'string'
			? value
			: Object.entries(collections).find((entry) => {
					return typeof value != 'string' && entry[1].name == value.name;
			  })?.[0] || 'null';
	$: value = _value;
</script>

<DropDown items={Object.keys(collections)} bind:selected={_value} label="Select Collection" />
