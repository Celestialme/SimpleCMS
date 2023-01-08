<script lang="ts">
	import env from '@root/env';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	// Skeleton
	import { menu } from '@skeletonlabs/skeleton';

	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	//https://github.com/beyonk-adventures/svelte-mapbox
	import { Map, Geocoder, Marker, controls } from '@beyonk/svelte-mapbox';

	const { GeolocateControl, NavigationControl, ScaleControl } = controls;

	let mapComponent;
	let lng = 69;
	let lat = 69;
	let zoom = 19;
	// Usage of methods like setCenter and flyto
	function onReady() {
		mapComponent.setCenter([lng, lat], zoom); // zoom is optional
		mapComponent.flyTo({ center: [lng, lat] }); // documentation (https://docs.mapbox.com/mapbox-gl-js/example/flyto)
	}

	// Define this to handle `eventname` events - see [GeoLocate Events](https://docs.mapbox.com/mapbox-gl-js/api/markers/#geolocatecontrol-events)
	function eventHandler(e) {
		const data = e.detail;
		// do something with `data`, it's the result returned from the mapbox event
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
	<div class="mb-2 rounded-md bg-red-500 text-center  text-white">
		<div class=" my-2 flex justify-between  gap-2 px-1 pt-1">
			<input
				required
				type="text"
				id="search"
				name="search"
				autocomplete="search"
				placeholder={$LL.WIDGET_Address_SearchMap()}
				class="rounded-md"
			/>

			<button class="btn btn-filled-primary btn-base rounded-md text-white"
				><Icon icon="bi:map" width="16" class="mr-2 " />{$LL.WIDGET_Address_GetAddress()}</button
			>
			<button class="btn btn-filled-primary btn-base rounded-md text-white"
				><Icon
					icon="bi:pin-map"
					width="16"
					class="mr-2 "
				/>{$LL.WIDGET_Address_GetAddress()}</button
			>
		</div>
		<!-- TODO: MAP Not working yet  -->
		Mapbox not displaying yet
		<Map
			accessToken={env.MAPBOX_API_TOKEN}
			bind:this={mapComponent}
			on:recentre={(e) => console.log(e.detail.center.lat, e.detail.center.lng)}
			on:ready={onReady}
			options={{ scrollZoom: false }}
		/>
	</div>

	<label for="name">{$LL.WIDGET_Address_Geocoordinates()}</label>
	<div class="flex justify-center gap-2 ">
		<input
			required
			type="text"
			id="latitude"
			name="latitude"
			autocomplete="latitude"
			placeholder={$LL.WIDGET_Address_Latitude()}
			class="rounded-md"
		/>

		<input
			required
			type="text"
			id="longitude"
			name="longitude"
			autocomplete="longitude"
			placeholder={$LL.WIDGET_Address_Longitude()}
			class="rounded-md"
		/>
	</div>
	<br />

	<form>
		<label for="name">{$LL.WIDGET_Address_Name()}</label>
		<input
			required
			type="text"
			id="name"
			name="name"
			autocomplete="name"
			placeholder={$LL.WIDGET_Address_Name()}
			class="rounded-md"
		/>

		<label for="street-address">{$LL.WIDGET_Address_Street()}</label>
		<input
			type="text"
			id="street-address"
			name="street-address"
			autocomplete="street-address"
			placeholder={$LL.WIDGET_Address_Street()}
			required
			enterkeyhint="next"
			class="rounded-md"
		/>

		<label for="postal-code">{$LL.WIDGET_Address_Zip()}</label>
		<input
			required
			type="text"
			id="postal-code"
			name="postal-code"
			placeholder={$LL.WIDGET_Address_Zip()}
			autocomplete="postal-code"
			enterkeyhint="next"
			class="rounded-md"
		/>

		<label for="city">{$LL.WIDGET_Address_City()}</label>
		<input
			required
			type="text"
			id="city"
			name="city"
			placeholder={$LL.WIDGET_Address_City()}
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
				placeholder={$LL.WIDGET_Address_SearchCountry()}
				class="btn btn-base relative w-full rounded-md bg-gray-300 pl-10 text-left text-white dark:bg-gray-600 "
			/>

			<Icon
				icon="ic:baseline-search"
				height="24"
				class="absolute top-3 left-2 text-slate-500 dark:text-gray-400"
			/>
			<nav
				class="list-nav card absolute top-0 left-0 max-h-40 overflow-auto p-4 shadow-xl"
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
