<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;

	let selected = 'Mr.'; // define as Placeholder
	let options = ['Mr.', 'Ms.', 'Mrs.', 'Dr.']; // replace data from collection
</script>

<select bind:value class="mt-[4px] rounded-md py-[0.35rem] ">
	<!-- TODO: add placeholder -->
	{#each options as value}<option {value}>{value}</option>{/each}
</select>
