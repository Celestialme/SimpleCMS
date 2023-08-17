<script lang="ts">
	import type { Schema } from '@src/collections/types';
	import collections from '@src/collections';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	export let value: Schema | string = '';
	export let theme: 'dark' | 'light' = 'dark';
	export let label = '';
	let _value =
		typeof value == 'string'
			? value
			: Object.entries(collections).find((entry) => {
					return typeof value != 'string' && entry[1].name == value.name;
			  })?.[0] || 'null';
	$: value = _value;
</script>

<DropDown items={Object.keys(collections)} bind:selected={_value} label="Select Collection" />
