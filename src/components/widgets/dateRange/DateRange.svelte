<script lang="ts">
	import { Datepicker } from "flowbite-svelte";
	export let field: any = undefined;
	export let value = "";

	export let widgetValue;
	$: widgetValue = value;
</script>

<Datepicker
	range
	datepickerTitle={field.datetitle}
	datepickerFormat={field.dateformat}
	bind:value
	class="input w-full "
/>
