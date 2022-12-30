<script lang="ts">
	import { Datepicker } from 'svelte-calendar';

	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<Datepicker bind:value />
