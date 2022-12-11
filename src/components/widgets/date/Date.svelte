<script lang="ts">
	import { Datepicker } from "flowbite-svelte";

	export let field: any = undefined;
	export let value = "";

	export let widgetValue;
	$: widgetValue = value;
</script>

<Datepicker datepickerButtons />
