<script lang="ts">
	import type { Schema } from '@src/collections/types';
	import { allCollections } from '@src/collections';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';

	export let value: Schema | string = '';

	let _value =
		typeof value == 'string'
			? value
			: Object.entries(allCollections).find((entry) => {
					return typeof value != 'string' && entry[1].name == value.name;
			  })?.[0] || 'null';
	$: value = _value;
</script>

<DropDown items={Object.keys(allCollections)} bind:selected={_value} label="Select Collection" />
