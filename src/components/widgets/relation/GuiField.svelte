<script lang="ts">
	import type { Schema } from '@src/collections/types';
	import { allCollections } from '@src/collections';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	export let value: Schema | string = '';
	export let theme: 'dark' | 'light' = 'dark';
	export let label = '';
	let _value =
		typeof value == 'string'
			? value
			: Object.entries(allCollections).find((entry) => {
					return typeof value != 'string' && entry[1].name == value.name;
			  })?.[0] || 'null';
	$: value = _value;
</script>

<FloatingInput bind:value={_value} type="text" bind:label name={label} {theme} />
