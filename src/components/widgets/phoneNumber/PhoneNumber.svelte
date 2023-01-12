<script lang="ts">
	// https://github.com/gyurielf/svelte-tel-input
	// add format like  https://svelte-tel-input.vercel.app/

	import TelInput from 'svelte-tel-input';
	import type { NormalizedTelNumber, CountryCode } from 'svelte-tel-input/types';

	// Any Country Code Alpha-2 (ISO 3166)
	let country: CountryCode = 'DE';

	export let field: any = undefined;
	export let value = '';

	export let widgetValue: NormalizedTelNumber | null = null;
	$: widgetValue = value;
</script>

<!-- TODO: validation number and display Country Code -->
<TelInput
	{country}
	placeholder={field.placeholder && field.placeholder !== '' ? field.placeholder : field.title}
	bind:value
	class="rounded-md"
/>
