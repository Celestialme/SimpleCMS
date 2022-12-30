<script lang="ts">
	import { Datepicker } from 'svelte-calendar';

	const today = new Date();
	const tomorrow = dayjs().add(1, 'day').toDate();

	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<Datepicker bind:value start={today} end={tomorrow} />
