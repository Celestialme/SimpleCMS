<script lang="ts">
	export let field: any = undefined;
	export let values = '';

	export let widgetValue;
	$: widgetValue = value;

	// https://github.com/gyurielf/svelte-tel-input
	// add format like  https://svelte-tel-input.vercel.app/

	import TelInput, { normalizedCountries } from 'svelte-tel-input';
	// Any Country Code Alpha-2 (ISO 3166)
	let selectedCountry = 'DE';

	// You must use E164 number format. It's guarantee the parsing and storing consistency. The library will always update (via binding) to E164 format.
	let value = '+442071838750';

	// Optional - Extended information about the parsed phone number
	let parsedTelInput: { nationalNumber: any } | null = null;

	// Field validity
	let isValid = true;
</script>

<div class="flex ">
	<select
		class="country-select {!isValid && 'invalid'} w-32 rounded-md"
		aria-label="Default select example"
		name="Country"
		bind:value={selectedCountry}
	>
		<option value={null} hidden={selectedCountry !== null}>Please select</option>
		{#each normalizedCountries as country (country.id)}
			<option
				value={country.iso2}
				selected={country.iso2 === selectedCountry}
				aria-selected={country.iso2 === selectedCountry}
			>
				{country.iso2} (+{country.dialCode})
			</option>
		{/each}
	</select>
	<TelInput
		bind:valid={isValid}
		bind:country={selectedCountry}
		bind:value
		bind:parsedTelInput
		class="basic-tel-input {!isValid && 'invalid'} rounded-md"
	/>
</div>

<!-- Just to show the nicely parsed phone number to you-->
{#if value && isValid && parsedTelInput?.nationalNumber}
	<h2>
		<span>Tel: <a href="tel:{value}">{parsedTelInput.nationalNumber}</a></span>
	</h2>
{/if}

<!-- TODO: validation number and display Country Code -->
<!-- <TelInput
	{country}
	placeholder={field.placeholder && field.placeholder !== ''
		? field.placeholder
		: field.db_fieldName}
	bind:value
	class="rounded-md"
/> -->
