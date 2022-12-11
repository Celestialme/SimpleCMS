<script lang="ts">
	import { Checkbox } from "flowbite-svelte";

	export let field: any = undefined;
	export let value = "";

	export let widgetValue;
	$: widgetValue = value;
</script>

<Checkbox
	color={field.color}
	bind:value
	class="input w-full"
	>{field.title}
</Checkbox>
