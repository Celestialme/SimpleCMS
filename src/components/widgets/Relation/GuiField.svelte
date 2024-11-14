<script lang="ts">
	import type { Schema } from '@src/collections/types';
	import { collections } from '@src/stores/store.svelte';
	import DropDown from '@src/components/system/dropDown/DropDown.svelte';
	import { track } from '@src/utils/reactivity.svelte';
	interface Props {
		value?: Schema | string;
	}

	let { value = $bindable('') }: Props = $props();
	let _value = $state(
		typeof value == 'string'
			? value
			: Object.values(collections()).find((entry) => {
					return typeof value != 'string' && entry[1].name == value.name;
				})?.[0] || 'null'
	);
	track(
		() => (value = _value),
		() => _value
	);
</script>

<DropDown
	items={Object.values(collections()).map((collection) => collection.path)}
	bind:selected={_value}
	label="Select Collection"
/>
