<script lang="ts">
	import { Radio } from "flowbite-svelte";

	export let field: any = undefined;
	export let value = "";

	export let widgetValue;
	$: widgetValue = value;
</script>

<Radio
	color={field.color}
	bind:value
	class="input w-full ">{field.title}</Radio
>
