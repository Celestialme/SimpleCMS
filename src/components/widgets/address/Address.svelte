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
</script>

<address>
	<!-- TODo: MAP Not working yet  -->
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
		<input required type="text" id="name" name="name" autocomplete="name" />

		<label for="street-address">Street address</label>
		<input
			type="text"
			id="street-address"
			name="street-address"
			autocomplete="street-address"
			required
			enterkeyhint="next"
		/>

		<label for="postal-code">ZIP or Postal Code</label>
		<input
			required
			type="text"
			id="postal-code"
			name="postal-code"
			autocomplete="postal-code"
			enterkeyhint="next"
		/>

		<label for="city">City</label>
		<input
			required
			type="text"
			id="city"
			name="city"
			autocomplete="address-level2"
			enterkeyhint="next"
		/>

		<!-- search -->

		<!-- Dropdown menu -->

		<span class="relative">
			<!-- Trigger: apply the 'use:menu' action and supply the unique menu ID -->
			<button use:menu={{ menu: 'example' }}> search </button>

			<!-- Menu: set a matching 'data-menu-[menuId]' attribute -->
			<nav class="list-nav card w-64 p-4 shadow-xl" data-menu="example">
				<ul class="divide-y">
					<li value="AF">Afghanistan</li>
					<li><a href="/">About</a></li>
					<li><a href="/">Blog</a></li>
					<li><button class="option w-full">Logout</button></li>
				</ul>
			</nav>
		</span>

		<!-- <Dropdown
			id="country"
			name="country"
			autocomplete="country"
			enterkeyhint="done"
			required
			class="h-44 overflow-y-auto px-3 pb-3 text-sm"
		>
			<li value="AF">Afghanistan</li>
			<li value="AX">Åland Islands</li>
			<li value="AL">Albania</li>
			<li value="DZ">Algeria</li>
			<li value="AS">American Samoa</li>
			<li value="AD">Andorra</li>
			<li value="AO">Angola</li>
			<li value="AI">Anguilla</li>
			<li value="AQ">Antarctica</li>
			<li value="AG">Antigua &amp; Barbuda</li>
			<li value="AR">Argentina</li>
			<li value="AM">Armenia</li>
			<li value="AW">Aruba</li>
			<li value="AC">Ascension Island</li>
			<li value="AU">Australia</li>
			<li value="AT">Austria</li>
			<li value="AZ">Azerbaijan</li>
			<li value="BS">Bahamas</li>
			<li value="BH">Bahrain</li>
			<li value="BD">Bangladesh</li>
			<li value="BB">Barbados</li>
			<li value="BY">Belarus</li>
			<li value="BE">Belgium</li>
			<li value="BZ">Belize</li>
			<li value="BJ">Benin</li>
			<li value="BM">Bermuda</li>
			<li value="BT">Bhutan</li>
			<li value="BO">Bolivia</li>
			<li value="BA">Bosnia &amp; Herzegovina</li>
			<li value="BW">Botswana</li>
			<li value="BV">Bouvet Island</li>
			<li value="BR">Brazil</li>
			<li value="IO">British Indian Ocean Territory</li>
			<li value="VG">British Virgin Islands</li>
			<li value="BN">Brunei</li>
			<li value="BG">Bulgaria</li>
			<li value="BF">Burkina Faso</li>
			<li value="BI">Burundi</li>
			<li value="KH">Cambodia</li>
			<li value="CM">Cameroon</li>
			<li value="CA">Canada</li>
			<li value="CV">Cape Verde</li>
			<li value="BQ">Caribbean Netherlands</li>
			<li value="KY">Cayman Islands</li>
			<li value="CF">Central African Republic</li>
			<li value="TD">Chad</li>
			<li value="CL">Chile</li>
			<li value="CN">China</li>
			<li value="CX">Christmas Island</li>
			<li value="CC">Cocos (Keeling) Islands</li>
			<li value="CO">Colombia</li>
			<li value="KM">Comoros</li>
			<li value="CG">Congo - Brazzaville</li>
			<li value="CD">Congo - Kinshasa</li>
			<li value="CK">Cook Islands</li>
			<li value="CR">Costa Rica</li>
			<li value="CI">Côte d’Ivoire</li>
			<li value="HR">Croatia</li>
			<li value="CW">Curaçao</li>
			<li value="CY">Cyprus</li>
			<li value="CZ">Czechia</li>
			<li value="DK">Denmark</li>
			<li value="DJ">Djibouti</li>
			<li value="DM">Dominica</li>
			<li value="DO">Dominican Republic</li>
			<li value="EC">Ecuador</li>
			<li value="EG">Egypt</li>
			<li value="SV">El Salvador</li>
			<li value="GQ">Equatorial Guinea</li>
			<li value="ER">Eritrea</li>
			<li value="EE">Estonia</li>
			<li value="SZ">Eswatini</li>
			<li value="ET">Ethiopia</li>
			<li value="FK">Falkland Islands (Islas Malvinas)</li>
			<li value="FO">Faroe Islands</li>
			<li value="FJ">Fiji</li>
			<li value="FI">Finland</li>
			<li value="FR">France</li>
			<li value="GF">French Guiana</li>
			<li value="PF">French Polynesia</li>
			<li value="TF">French Southern Territories</li>
			<li value="GA">Gabon</li>
			<li value="GM">Gambia</li>
			<li value="GE">Georgia</li>
			<li value="DE">Germany</li>
			<li value="GH">Ghana</li>
			<li value="GI">Gibraltar</li>
			<li value="GR">Greece</li>
			<li value="GL">Greenland</li>
			<li value="GD">Grenada</li>
			<li value="GP">Guadeloupe</li>
			<li value="GU">Guam</li>
			<li value="GT">Guatemala</li>
			<li value="GG">Guernsey</li>
			<li value="GN">Guinea</li>
			<li value="GW">Guinea-Bissau</li>
			<li value="GY">Guyana</li>
			<li value="HT">Haiti</li>
			<li value="HM">Heard &amp; McDonald Islands</li>
			<li value="HN">Honduras</li>
			<li value="HK">Hong Kong</li>
			<li value="HU">Hungary</li>
			<li value="IS">Iceland</li>
			<li value="IN">India</li>
			<li value="ID">Indonesia</li>
			<li value="IR">Iran</li>
			<li value="IQ">Iraq</li>
			<li value="IE">Ireland</li>
			<li value="IM">Isle of Man</li>
			<li value="IL">Israel</li>
			<li value="IT">Italy</li>
			<li value="JM">Jamaica</li>
			<li value="JP">Japan</li>
			<li value="JE">Jersey</li>
			<li value="JO">Jordan</li>
			<li value="KZ">Kazakhstan</li>
			<li value="KE">Kenya</li>
			<li value="KI">Kiribati</li>
			<li value="XK">Kosovo</li>
			<li value="KW">Kuwait</li>
			<li value="KG">Kyrgyzstan</li>
			<li value="LA">Laos</li>
			<li value="LV">Latvia</li>
			<li value="LB">Lebanon</li>
			<li value="LS">Lesotho</li>
			<li value="LR">Liberia</li>
			<li value="LY">Libya</li>
			<li value="LI">Liechtenstein</li>
			<li value="LT">Lithuania</li>
			<li value="LU">Luxembourg</li>
			<li value="MO">Macao</li>
			<li value="MG">Madagascar</li>
			<li value="MW">Malawi</li>
			<li value="MY">Malaysia</li>
			<li value="MV">Maldives</li>
			<li value="ML">Mali</li>
			<li value="MT">Malta</li>
			<li value="MH">Marshall Islands</li>
			<li value="MQ">Martinique</li>
			<li value="MR">Mauritania</li>
			<li value="MU">Mauritius</li>
			<li value="YT">Mayotte</li>
			<li value="MX">Mexico</li>
			<li value="FM">Micronesia</li>
			<li value="MD">Moldova</li>
			<li value="MC">Monaco</li>
			<li value="MN">Mongolia</li>
			<li value="ME">Montenegro</li>
			<li value="MS">Montserrat</li>
			<li value="MA">Morocco</li>
			<li value="MZ">Mozambique</li>
			<li value="MM">Myanmar (Burma)</li>
			<li value="NA">Namibia</li>
			<li value="NR">Nauru</li>
			<li value="NP">Nepal</li>
			<li value="NL">Netherlands</li>
			<li value="NC">New Caledonia</li>
			<li value="NZ">New Zealand</li>
			<li value="NI">Nicaragua</li>
			<li value="NE">Niger</li>
			<li value="NG">Nigeria</li>
			<li value="NU">Niue</li>
			<li value="NF">Norfolk Island</li>
			<li value="KP">North Korea</li>
			<li value="MK">North Macedonia</li>
			<li value="MP">Northern Mariana Islands</li>
			<li value="NO">Norway</li>
			<li value="OM">Oman</li>
			<li value="PK">Pakistan</li>
			<li value="PW">Palau</li>
			<li value="PS">Palestine</li>
			<li value="PA">Panama</li>
			<li value="PG">Papua New Guinea</li>
			<li value="PY">Paraguay</li>
			<li value="PE">Peru</li>
			<li value="PH">Philippines</li>
			<li value="PN">Pitcairn Islands</li>
			<li value="PL">Poland</li>
			<li value="PT">Portugal</li>
			<li value="PR">Puerto Rico</li>
			<li value="QA">Qatar</li>
			<li value="RE">Réunion</li>
			<li value="RO">Romania</li>
			<li value="RU">Russia</li>
			<li value="RW">Rwanda</li>
			<li value="WS">Samoa</li>
			<li value="SM">San Marino</li>
			<li value="ST">São Tomé &amp; Príncipe</li>
			<li value="SA">Saudi Arabia</li>
			<li value="SN">Senegal</li>
			<li value="RS">Serbia</li>
			<li value="SC">Seychelles</li>
			<li value="SL">Sierra Leone</li>
			<li value="SG">Singapore</li>
			<li value="SX">Sint Maarten</li>
			<li value="SK">Slovakia</li>
			<li value="SI">Slovenia</li>
			<li value="SB">Solomon Islands</li>
			<li value="SO">Somalia</li>
			<li value="ZA">South Africa</li>
			<li value="GS">South Georgia &amp; South Sandwich Islands</li>
			<li value="KR">South Korea</li>
			<li value="SS">South Sudan</li>
			<li value="ES">Spain</li>
			<li value="LK">Sri Lanka</li>
			<li value="BL">St Barthélemy</li>
			<li value="SH">St Helena</li>
			<li value="KN">St Kitts &amp; Nevis</li>
			<li value="LC">St Lucia</li>
			<li value="MF">St Martin</li>
			<li value="PM">St Pierre &amp; Miquelon</li>
			<li value="VC">St Vincent &amp; Grenadines</li>
			<li value="SR">Suriname</li>
			<li value="SJ">Svalbard &amp; Jan Mayen</li>
			<li value="SE">Sweden</li>
			<li value="CH">Switzerland</li>
			<li value="TW">Taiwan</li>
			<li value="TJ">Tajikistan</li>
			<li value="TZ">Tanzania</li>
			<li value="TH">Thailand</li>
			<li value="TL">Timor-Leste</li>
			<li value="TG">Togo</li>
			<li value="TK">Tokelau</li>
			<li value="TO">Tonga</li>
			<li value="TT">Trinidad &amp; Tobago</li>
			<li value="TA">Tristan da Cunha</li>
			<li value="TN">Tunisia</li>
			<li value="TR">Turkey</li>
			<li value="TM">Turkmenistan</li>
			<li value="TC">Turks &amp; Caicos Islands</li>
			<li value="TV">Tuvalu</li>
			<li value="UG">Uganda</li>
			<li value="UA">Ukraine</li>
			<li value="AE">United Arab Emirates</li>
			<li value="GB">United Kingdom</li>
			<li value="US">United States</li>
			<li value="UY">Uruguay</li>
			<li value="UM">US Outlying Islands</li>
			<li value="VI">US Virgin Islands</li>
			<li value="UZ">Uzbekistan</li>
			<li value="VU">Vanuatu</li>
			<li value="VA">Vatican City</li>
			<li value="VE">Venezuela</li>
			<li value="VN">Vietnam</li>
			<li value="WF">Wallis &amp; Futuna</li>
			<li value="EH">Western Sahara</li>
			<li value="YE">Yemen</li>
			<li value="ZM">Zambia</li>
			<li value="ZW">Zimbabwe</li>
		</Dropdown> -->
	</form>
</address>
