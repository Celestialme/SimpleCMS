<script lang="ts">
	import dayjs from 'dayjs';
	import { Datepicker } from 'svelte-calendar';

	// TODO: Allow User/System to define Date formate
	let format = 'ddd, MMMM D, YYYY';

	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<!-- TODO: Enhance Date entry -->
<!-- <Datepicker bind:store let:key let:send let:receive>
	<button in:receive|local={{ key }} out:send|local={{ key }}>
		{#if $store?.hasChosen}
			{dayjs($store.selected).format('ddd MMM D, YYYY')}
		{:else}
			Pick a Date
		{/if}
	</button>
</Datepicker> -->

<Datepicker {format} />
<input type="date" bind:value={format} class="rounded-md" />
