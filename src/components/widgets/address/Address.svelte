<script lang="ts">
	// Skeleton
	import { menu } from '@skeletonlabs/skeleton';

	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	import { Map, Geocoder, Marker } from '@beyonk/svelte-mapbox';
	import env from '@root/env';

	let mapComponent: { flyTo: (arg0: { center: number[] }) => void };

	function onReady() {
		mapComponent.flyTo({ center: [51.3405894, 6.6066283] });
	}

	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;

	// https://stefangabos.github.io/world_countries/
	import countries from './countries.json';
	import '/node_modules/flag-icons/css/flag-icons.min.css';

	let selectedCountry = '';

	// Initialize a filtered array of countries that will be displayed in the dropdown menu
	let filteredCountries = countries;

	function searchCountry(event) {
		// Get the search query from the input field
		let query = event.target.value;

		// Filter the countries array based on the search query
		filteredCountries = countries.filter((country) =>
			country.en.toLowerCase().includes(query.toLowerCase())
		);
	}
</script>

<address>
	<!-- TODO: MAP Not working yet  -->
	<Map
		accessToken={env.MAPBOX_API_TOKEN}
		style="mapbox://styles/mapbox/streets-v8"
		bind:this={mapComponent}
		on:ready={onReady}
	>
		<Marker lat="51.3405894" lng="6.6066283" label="Asset-Trade" />
	</Map>

	<form>
		<label for="name">Name</label>
		<input
			required
			type="text"
			id="name"
			name="name"
			autocomplete="name"
			placeholder="Name"
			class="rounded-md"
		/>

		<label for="street-address">Street address</label>
		<input
			type="text"
			id="street-address"
			name="street-address"
			autocomplete="street-address"
			placeholder="Street address"
			required
			enterkeyhint="next"
			class="rounded-md"
		/>

		<label for="postal-code">ZIP or Postal Code</label>
		<input
			required
			type="text"
			id="postal-code"
			name="postal-code"
			placeholder="ZIP or Postal Code"
			autocomplete="postal-code"
			enterkeyhint="next"
			class="rounded-md"
		/>

		<label for="city">City</label>
		<input
			required
			type="text"
			id="city"
			name="city"
			placeholder="City"
			autocomplete="city"
			enterkeyhint="next"
			class="rounded-md"
		/>

		<!-- Dropdown Country with search -->
		<label class="relative mt-3">
			<input
				bind:value={selectedCountry}
				on:keyup={searchCountry}
				use:menu={{ menu: 'country' }}
				id="country"
				placeholder="Search Country ..."
				class="btn btn-base relative w-full rounded-md bg-gray-300 pl-10 text-left text-white dark:bg-gray-600 "
			/>

			<Icon
				icon="ic:baseline-search"
				height="24"
				class="absolute top-3 left-2 text-slate-500 dark:text-gray-400"
			/>
			<nav
				class="list-nav card absolute top-0 left-0 max-h-40 w-64 overflow-auto p-4 shadow-xl"
				data-menu="country"
			>
				<ul class=" divide-y divide-gray-500">
					<!-- add system-language -->
					{#each filteredCountries as country}
						<li
							class="flex gap-2"
							value={country.en}
							on:click={() => (selectedCountry = country.en)}
						>
							<span class="fi fi-{country.alpha2} mt-1" />
							{country.en} - <span class="mt-1 uppercase">{country.alpha2}</span>
						</li>
					{/each}
				</ul>
			</nav>
		</label>
	</form>
</address>
