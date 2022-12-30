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

	let countries = [
		{ code: 'AF', name: 'Afghanistan' },
		{ code: 'AX', name: 'Åland Islands' },
		{ code: 'AL', name: 'Albania' },
		{ code: 'DZ', name: 'Algeria' },
		{ code: 'AS', name: 'American Samoa' },
		{ code: 'AD', name: 'Andorra' },
		{ code: 'AO', name: 'Angola' },
		{ code: 'AI', name: 'Anguilla' },
		{ code: 'AQ', name: 'Antarctica' },
		{ code: 'AG', name: 'Antigua &amp; Barbuda' },
		{ code: 'AR', name: 'Argentina' },
		{ code: 'AM', name: 'Armenia' },
		{ code: 'AW', name: 'Aruba' },
		{ code: 'AC', name: 'Ascension Island' },
		{ code: 'AU', name: 'Australia' },
		{ code: 'AT', name: 'Austria' },
		{ code: 'AZ', name: 'Azerbaijan' },
		{ code: 'BS', name: 'Bahamas' },
		{ code: 'BH', name: 'Bahrain' },
		{ code: 'BD', name: 'Bangladesh' },
		{ code: 'BB', name: 'Barbados' },
		{ code: 'BY', name: 'Belarus' },
		{ code: 'BE', name: 'Belgium' },
		{ code: 'BZ', name: 'Belize' },
		{ code: 'BJ', name: 'Benin' },
		{ code: 'BM', name: 'Bermuda' },
		{ code: 'BT', name: 'Bhutan' },
		{ code: 'BO', name: 'Bolivia' },
		{ code: 'BA', name: 'Bosnia &amp; Herzegovina' },
		{ code: 'BW', name: 'Botswana' },
		{ code: 'BV', name: 'Bouvet Island' },
		{ code: 'BR', name: 'Brazil' },
		{ code: 'IO', name: 'British Indian Ocean Territory' },
		{ code: 'VG', name: 'British Virgin Islands' },
		{ code: 'BN', name: 'Brunei' },
		{ code: 'BG', name: 'Bulgaria' },
		{ code: 'BF', name: 'Burkina Faso' },
		{ code: 'BI', name: 'Burundi' },
		{ code: 'KH', name: 'Cambodia' },
		{ code: 'CM', name: 'Cameroon' },
		{ code: 'CA', name: 'Canada' },
		{ code: 'CV', name: 'Cape Verde' },
		{ code: 'BQ', name: 'Caribbean Netherlands' },
		{ code: 'KY', name: 'Cayman Islands' },
		{ code: 'CF', name: 'Central African Republic' },
		{ code: 'TD', name: 'Chad' },
		{ code: 'CL', name: 'Chile' },
		{ code: 'CN', name: 'China' },
		{ code: 'CX', name: 'Christmas Island' },
		{ code: 'CC', name: 'Cocos (Keeling) Islands' },
		{ code: 'CO', name: 'Colombia' },
		{ code: 'KM', name: 'Comoros' },
		{ code: 'CG', name: 'Congo - Brazzaville' },
		{ code: 'CD', name: 'Congo - Kinshasa' },
		{ code: 'CK', name: 'Cook Islands' },
		{ code: 'CR', name: 'Costa Rica' },
		{ code: 'CI', name: 'Côte d’Ivoire' },
		{ code: 'HR', name: 'Croatia' },
		{ code: 'CW', name: 'Curaçao' },
		{ code: 'CY', name: 'Cyprus' },
		{ code: 'CZ', name: 'Czechia' },
		{ code: 'DK', name: 'Denmark' },
		{ code: 'DJ', name: 'Djibouti' },
		{ code: 'DM', name: 'Dominica' },
		{ code: 'DO', name: 'Dominican Republic' },
		{ code: 'EC', name: 'Ecuador' },
		{ code: 'EG', name: 'Egypt' },
		{ code: 'SV', name: 'El Salvador' },
		{ code: 'GQ', name: 'Equatorial Guinea' },
		{ code: 'ER', name: 'Eritrea' },
		{ code: 'EE', name: 'Estonia' },
		{ code: 'SZ', name: 'Eswatini' },
		{ code: 'ET', name: 'Ethiopia' },
		{ code: 'FK', name: 'Falkland Islands (Islas Malvinas)' },
		{ code: 'FO', name: 'Faroe Islands' },
		{ code: 'FJ', name: 'Fiji' },
		{ code: 'FI', name: 'Finland' },
		{ code: 'FR', name: 'France' },
		{ code: 'GF', name: 'French Guiana' },
		{ code: 'PF', name: 'French Polynesia' },
		{ code: 'TF', name: 'French Southern Territories' },
		{ code: 'GA', name: 'Gabon' },
		{ code: 'GM', name: 'Gambia' },
		{ code: 'GE', name: 'Georgia' },
		{ code: 'DE', name: 'Germany' },
		{ code: 'GH', name: 'Ghana' },
		{ code: 'GI', name: 'Gibraltar' },
		{ code: 'GR', name: 'Greece' },
		{ code: 'GL', name: 'Greenland' },
		{ code: 'GD', name: 'Grenada' },
		{ code: 'GP', name: 'Guadeloupe' },
		{ code: 'GU', name: 'Guam' },
		{ code: 'GT', name: 'Guatemala' },
		{ code: 'GG', name: 'Guernsey' },
		{ code: 'GN', name: 'Guinea' },
		{ code: 'GW', name: 'Guinea-Bissau' },
		{ code: 'GY', name: 'Guyana' },
		{ code: 'HT', name: 'Haiti' },
		{ code: 'HM', name: 'Heard &amp; McDonald Islands' },
		{ code: 'HN', name: 'Honduras' },
		{ code: 'HK', name: 'Hong Kong' },
		{ code: 'HU', name: 'Hungary' },
		{ code: 'IS', name: 'Iceland' },
		{ code: 'IN', name: 'India' },
		{ code: 'ID', name: 'Indonesia' },
		{ code: 'IR', name: 'Iran' },
		{ code: 'IQ', name: 'Iraq' },
		{ code: 'IE', name: 'Ireland' },
		{ code: 'IM', name: 'Isle of Man' },
		{ code: 'IL', name: 'Israel' },
		{ code: 'IT', name: 'Italy' },
		{ code: 'JM', name: 'Jamaica' },
		{ code: 'JP', name: 'Japan' },
		{ code: 'JE', name: 'Jersey' },
		{ code: 'JO', name: 'Jordan' },
		{ code: 'KZ', name: 'Kazakhstan' },
		{ code: 'KE', name: 'Kenya' },
		{ code: 'KI', name: 'Kiribati' },
		{ code: 'XK', name: 'Kosovo' },
		{ code: 'KW', name: 'Kuwait' },
		{ code: 'KG', name: 'Kyrgyzstan' },
		{ code: 'LA', name: 'Laos' },
		{ code: 'LV', name: 'Latvia' },
		{ code: 'LB', name: 'Lebanon' },
		{ code: 'LS', name: 'Lesotho' },
		{ code: 'LR', name: 'Liberia' },
		{ code: 'LY', name: 'Libya' },
		{ code: 'LI', name: 'Liechtenstein' },
		{ code: 'LT', name: 'Lithuania' },
		{ code: 'LU', name: 'Luxembourg' },
		{ code: 'MO', name: 'Macao' },
		{ code: 'MG', name: 'Madagascar' },
		{ code: 'MW', name: 'Malawi' },
		{ code: 'MY', name: 'Malaysia' },
		{ code: 'MV', name: 'Maldives' },
		{ code: 'ML', name: 'Mali' },
		{ code: 'MT', name: 'Malta' },
		{ code: 'MH', name: 'Marshall Islands' },
		{ code: 'MQ', name: 'Martinique' },
		{ code: 'MR', name: 'Mauritania' },
		{ code: 'MU', name: 'Mauritius' },
		{ code: 'YT', name: 'Mayotte' },
		{ code: 'MX', name: 'Mexico' },
		{ code: 'FM', name: 'Micronesia' },
		{ code: 'MD', name: 'Moldova' },
		{ code: 'MC', name: 'Monaco' },
		{ code: 'MN', name: 'Mongolia' },
		{ code: 'ME', name: 'Montenegro' },
		{ code: 'MS', name: 'Montserrat' },
		{ code: 'MA', name: 'Morocco' },
		{ code: 'MZ', name: 'Mozambique' },
		{ code: 'MM', name: 'Myanmar (Burma)' },
		{ code: 'NA', name: 'Namibia' },
		{ code: 'NR', name: 'Nauru' },
		{ code: 'NP', name: 'Nepal' },
		{ code: 'NL', name: 'Netherlands' },
		{ code: 'NC', name: 'New Caledonia' },
		{ code: 'NZ', name: 'New Zealand' },
		{ code: 'NI', name: 'Nicaragua' },
		{ code: 'NE', name: 'Niger' },
		{ code: 'NG', name: 'Nigeria' },
		{ code: 'NU', name: 'Niue' },
		{ code: 'NF', name: 'Norfolk Island' },
		{ code: 'KP', name: 'North Korea' },
		{ code: 'MK', name: 'North Macedonia' },
		{ code: 'MP', name: 'Northern Mariana Islands' },
		{ code: 'NO', name: 'Norway' },
		{ code: 'OM', name: 'Oman' },
		{ code: 'PK', name: 'Pakistan' },
		{ code: 'PW', name: 'Palau' },
		{ code: 'PS', name: 'Palestine' },
		{ code: 'PA', name: 'Panama' },
		{ code: 'PG', name: 'Papua New Guinea' },
		{ code: 'PY', name: 'Paraguay' },
		{ code: 'PE', name: 'Peru' },
		{ code: 'PH', name: 'Philippines' },
		{ code: 'PN', name: 'Pitcairn Islands' },
		{ code: 'PL', name: 'Poland' },
		{ code: 'PT', name: 'Portugal' },
		{ code: 'PR', name: 'Puerto Rico' },
		{ code: 'QA', name: 'Qatar' },
		{ code: 'RE', name: 'Réunion' },
		{ code: 'RO', name: 'Romania' },
		{ code: 'RU', name: 'Russia' },
		{ code: 'RW', name: 'Rwanda' },
		{ code: 'WS', name: 'Samoa' },
		{ code: 'SM', name: 'San Marino' },
		{ code: 'ST', name: 'São Tomé &amp; Príncipe' },
		{ code: 'SA', name: 'Saudi Arabia' },
		{ code: 'SN', name: 'Senegal' },
		{ code: 'RS', name: 'Serbia' },
		{ code: 'SC', name: 'Seychelles' },
		{ code: 'SL', name: 'Sierra Leone' },
		{ code: 'SG', name: 'Singapore' },
		{ code: 'SX', name: 'Sint Maarten' },
		{ code: 'SK', name: 'Slovakia' },
		{ code: 'SI', name: 'Slovenia' },
		{ code: 'SB', name: 'Solomon Islands' },
		{ code: 'SO', name: 'Somalia' },
		{ code: 'ZA', name: 'South Africa' },
		{ code: 'GS', name: 'South Georgia &amp; South Sandwich Islands' },
		{ code: 'KR', name: 'South Korea' },
		{ code: 'SS', name: 'South Sudan' },
		{ code: 'ES', name: 'Spain' },
		{ code: 'LK', name: 'Sri Lanka' },
		{ code: 'BL', name: 'St Barthélemy' },
		{ code: 'SH', name: 'St Helena' },
		{ code: 'KN', name: 'St Kitts &amp; Nevis' },
		{ code: 'LC', name: 'St Lucia' },
		{ code: 'MF', name: 'St Martin' },
		{ code: 'PM', name: 'St Pierre &amp; Miquelon' },
		{ code: 'VC', name: 'St Vincent &amp; Grenadines' },
		{ code: 'SR', name: 'Suriname' },
		{ code: 'SJ', name: 'Svalbard &amp; Jan Mayen' },
		{ code: 'SE', name: 'Sweden' },
		{ code: 'CH', name: 'Switzerland' },
		{ code: 'TW', name: 'Taiwan' },
		{ code: 'TJ', name: 'Tajikistan' },
		{ code: 'TZ', name: 'Tanzania' },
		{ code: 'TH', name: 'Thailand' },
		{ code: 'TL', name: 'Timor-Leste' },
		{ code: 'TG', name: 'Togo' },
		{ code: 'TK', name: 'Tokelau' },
		{ code: 'TO', name: 'Tonga' },
		{ code: 'TT', name: 'Trinidad &amp; Tobago' },
		{ code: 'TA', name: 'Tristan da Cunha' },
		{ code: 'TN', name: 'Tunisia' },
		{ code: 'TR', name: 'Turkey' },
		{ code: 'TM', name: 'Turkmenistan' },
		{ code: 'TC', name: 'Turks &amp; Caicos Islands' },
		{ code: 'TV', name: 'Tuvalu' },
		{ code: 'UG', name: 'Uganda' },
		{ code: 'UA', name: 'Ukraine' },
		{ code: 'AE', name: 'United Arab Emirates' },
		{ code: 'GB', name: 'United Kingdom' },
		{ code: 'US', name: 'United States' },
		{ code: 'UY', name: 'Uruguay' },
		{ code: 'UM', name: 'US Outlying Islands' },
		{ code: 'VI', name: 'US Virgin Islands' },
		{ code: 'UZ', name: 'Uzbekistan' },
		{ code: 'VU', name: 'Vanuatu' },
		{ code: 'VA', name: 'Vatican City' },
		{ code: 'VE', name: 'Venezuela' },
		{ code: 'VN', name: 'Vietnam' },
		{ code: 'WF', name: 'Wallis &amp; Futuna' },
		{ code: 'EH', name: 'Western Sahara' },
		{ code: 'YE', name: 'Yemen' },
		{ code: 'ZM', name: 'Zambia' },
		{ code: 'ZW', name: 'Zimbabwe' }
	];

	let selectedCountry = '';

	// Initialize a filtered array of countries that will be displayed in the dropdown menu
	let filteredCountries = countries;

	function searchCountry(event) {
		// Get the search query from the input field
		let query = event.target.value;

		// Filter the countries array based on the search query
		filteredCountries = countries.filter((country) =>
			country.name.toLowerCase().includes(query.toLowerCase())
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
				<ul class="divide-y divide-gray-500">
					{#each filteredCountries as country}
						<li value={country.code} on:click={() => (selectedCountry = country.name)}>
							{country.name}
						</li>
					{/each}
				</ul>
			</nav>
		</label>
	</form>
</address>
