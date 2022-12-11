<script lang="ts">
	import { Input } from "flowbite-svelte";

	export let field: any = undefined;
	export let value = "";

	export let widgetValue;
	$: widgetValue = value;
</script>

<Input
	bind:value
	type="email"
	id="email"
	placeholder={field.placeholder}
	class="input w-full"
/>
