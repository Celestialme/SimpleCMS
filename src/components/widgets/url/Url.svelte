<script lang="ts">
	import { Input } from "flowbite-svelte";

	export let field: any = undefined;
	export let value = "";

	export let widgetValue;
	$: widgetValue = value;
</script>

<Input
	type="url"
	id="website"
	placeholder={field.placeholder}
	bind:value
	class="input w-full "
/>
