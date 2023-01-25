<script lang="ts">
	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;

	let selected = 'Mr.'; // define as Placeholder
	// TODO Translate Array
	let options = ['Mr.', 'Ms.', 'Mrs.', 'Dr.']; // replace data from collection
</script>

<select bind:value class="mt-[4px] py-[0.35rem] ">
	<!-- TODO: add placeholder -->
	{#each options as value}<option {value}>{value}</option>{/each}
</select>
