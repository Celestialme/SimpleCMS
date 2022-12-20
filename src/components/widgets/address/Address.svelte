<script lang="ts">
	import { Button, Input, Label, Dropdown, DropdownItem, Search } from 'flowbite-svelte';

	import { Map, Marker } from '@beyonk/svelte-mapbox';
	import env from '@root/env';
	let mapComponent;

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
		accessToken={env.MAPBOX_TOKEN}
		style="mapbox://styles/mapbox/streets-v12"
		bind:this={mapComponent}
		on:ready={onReady}
	>
		<Marker lat="51.3405894" lng="6.6066283" label="Asset-Trade" />
	</Map>

	<form>
		<Label for="name">Name</Label>
		<Input required type="text" id="name" name="name" autocomplete="name" />

		<Label for="street-address">Street address</Label>
		<Input
			type="text"
			id="street-address"
			name="street-address"
			autocomplete="street-address"
			required
			enterkeyhint="next"
		/>

		<Label for="postal-code">ZIP or Postal Code</Label>
		<Input
			class="postal-code"
			id="postal-code"
			name="postal-code"
			autocomplete="postal-code"
			enterkeyhint="next"
		/>

		<Label for="city">City</Label>
		<Input
			required
			type="text"
			id="city"
			name="city"
			autocomplete="address-level2"
			enterkeyhint="next"
		/>

		<Input id="country" slot="header" class="p-3"
			>Country or region
			<Search size="md" />
		</Input>
		<Dropdown
			id="country"
			name="country"
			autocomplete="country"
			enterkeyhint="done"
			required
			class="h-44 overflow-y-auto px-3 pb-3 text-sm"
		>
			<DropdownItem value="AF">Afghanistan</DropdownItem>
			<DropdownItem value="AX">Åland Islands</DropdownItem>
			<DropdownItem value="AL">Albania</DropdownItem>
			<DropdownItem value="DZ">Algeria</DropdownItem>
			<DropdownItem value="AS">American Samoa</DropdownItem>
			<DropdownItem value="AD">Andorra</DropdownItem>
			<DropdownItem value="AO">Angola</DropdownItem>
			<DropdownItem value="AI">Anguilla</DropdownItem>
			<DropdownItem value="AQ">Antarctica</DropdownItem>
			<DropdownItem value="AG">Antigua &amp; Barbuda</DropdownItem>
			<DropdownItem value="AR">Argentina</DropdownItem>
			<DropdownItem value="AM">Armenia</DropdownItem>
			<DropdownItem value="AW">Aruba</DropdownItem>
			<DropdownItem value="AC">Ascension Island</DropdownItem>
			<DropdownItem value="AU">Australia</DropdownItem>
			<DropdownItem value="AT">Austria</DropdownItem>
			<DropdownItem value="AZ">Azerbaijan</DropdownItem>
			<DropdownItem value="BS">Bahamas</DropdownItem>
			<DropdownItem value="BH">Bahrain</DropdownItem>
			<DropdownItem value="BD">Bangladesh</DropdownItem>
			<DropdownItem value="BB">Barbados</DropdownItem>
			<DropdownItem value="BY">Belarus</DropdownItem>
			<DropdownItem value="BE">Belgium</DropdownItem>
			<DropdownItem value="BZ">Belize</DropdownItem>
			<DropdownItem value="BJ">Benin</DropdownItem>
			<DropdownItem value="BM">Bermuda</DropdownItem>
			<DropdownItem value="BT">Bhutan</DropdownItem>
			<DropdownItem value="BO">Bolivia</DropdownItem>
			<DropdownItem value="BA">Bosnia &amp; Herzegovina</DropdownItem>
			<DropdownItem value="BW">Botswana</DropdownItem>
			<DropdownItem value="BV">Bouvet Island</DropdownItem>
			<DropdownItem value="BR">Brazil</DropdownItem>
			<DropdownItem value="IO">British Indian Ocean Territory</DropdownItem>
			<DropdownItem value="VG">British Virgin Islands</DropdownItem>
			<DropdownItem value="BN">Brunei</DropdownItem>
			<DropdownItem value="BG">Bulgaria</DropdownItem>
			<DropdownItem value="BF">Burkina Faso</DropdownItem>
			<DropdownItem value="BI">Burundi</DropdownItem>
			<DropdownItem value="KH">Cambodia</DropdownItem>
			<DropdownItem value="CM">Cameroon</DropdownItem>
			<DropdownItem value="CA">Canada</DropdownItem>
			<DropdownItem value="CV">Cape Verde</DropdownItem>
			<DropdownItem value="BQ">Caribbean Netherlands</DropdownItem>
			<DropdownItem value="KY">Cayman Islands</DropdownItem>
			<DropdownItem value="CF">Central African Republic</DropdownItem>
			<DropdownItem value="TD">Chad</DropdownItem>
			<DropdownItem value="CL">Chile</DropdownItem>
			<DropdownItem value="CN">China</DropdownItem>
			<DropdownItem value="CX">Christmas Island</DropdownItem>
			<DropdownItem value="CC">Cocos (Keeling) Islands</DropdownItem>
			<DropdownItem value="CO">Colombia</DropdownItem>
			<DropdownItem value="KM">Comoros</DropdownItem>
			<DropdownItem value="CG">Congo - Brazzaville</DropdownItem>
			<DropdownItem value="CD">Congo - Kinshasa</DropdownItem>
			<DropdownItem value="CK">Cook Islands</DropdownItem>
			<DropdownItem value="CR">Costa Rica</DropdownItem>
			<DropdownItem value="CI">Côte d’Ivoire</DropdownItem>
			<DropdownItem value="HR">Croatia</DropdownItem>
			<DropdownItem value="CW">Curaçao</DropdownItem>
			<DropdownItem value="CY">Cyprus</DropdownItem>
			<DropdownItem value="CZ">Czechia</DropdownItem>
			<DropdownItem value="DK">Denmark</DropdownItem>
			<DropdownItem value="DJ">Djibouti</DropdownItem>
			<DropdownItem value="DM">Dominica</DropdownItem>
			<DropdownItem value="DO">Dominican Republic</DropdownItem>
			<DropdownItem value="EC">Ecuador</DropdownItem>
			<DropdownItem value="EG">Egypt</DropdownItem>
			<DropdownItem value="SV">El Salvador</DropdownItem>
			<DropdownItem value="GQ">Equatorial Guinea</DropdownItem>
			<DropdownItem value="ER">Eritrea</DropdownItem>
			<DropdownItem value="EE">Estonia</DropdownItem>
			<DropdownItem value="SZ">Eswatini</DropdownItem>
			<DropdownItem value="ET">Ethiopia</DropdownItem>
			<DropdownItem value="FK">Falkland Islands (Islas Malvinas)</DropdownItem>
			<DropdownItem value="FO">Faroe Islands</DropdownItem>
			<DropdownItem value="FJ">Fiji</DropdownItem>
			<DropdownItem value="FI">Finland</DropdownItem>
			<DropdownItem value="FR">France</DropdownItem>
			<DropdownItem value="GF">French Guiana</DropdownItem>
			<DropdownItem value="PF">French Polynesia</DropdownItem>
			<DropdownItem value="TF">French Southern Territories</DropdownItem>
			<DropdownItem value="GA">Gabon</DropdownItem>
			<DropdownItem value="GM">Gambia</DropdownItem>
			<DropdownItem value="GE">Georgia</DropdownItem>
			<DropdownItem value="DE">Germany</DropdownItem>
			<DropdownItem value="GH">Ghana</DropdownItem>
			<DropdownItem value="GI">Gibraltar</DropdownItem>
			<DropdownItem value="GR">Greece</DropdownItem>
			<DropdownItem value="GL">Greenland</DropdownItem>
			<DropdownItem value="GD">Grenada</DropdownItem>
			<DropdownItem value="GP">Guadeloupe</DropdownItem>
			<DropdownItem value="GU">Guam</DropdownItem>
			<DropdownItem value="GT">Guatemala</DropdownItem>
			<DropdownItem value="GG">Guernsey</DropdownItem>
			<DropdownItem value="GN">Guinea</DropdownItem>
			<DropdownItem value="GW">Guinea-Bissau</DropdownItem>
			<DropdownItem value="GY">Guyana</DropdownItem>
			<DropdownItem value="HT">Haiti</DropdownItem>
			<DropdownItem value="HM">Heard &amp; McDonald Islands</DropdownItem>
			<DropdownItem value="HN">Honduras</DropdownItem>
			<DropdownItem value="HK">Hong Kong</DropdownItem>
			<DropdownItem value="HU">Hungary</DropdownItem>
			<DropdownItem value="IS">Iceland</DropdownItem>
			<DropdownItem value="IN">India</DropdownItem>
			<DropdownItem value="ID">Indonesia</DropdownItem>
			<DropdownItem value="IR">Iran</DropdownItem>
			<DropdownItem value="IQ">Iraq</DropdownItem>
			<DropdownItem value="IE">Ireland</DropdownItem>
			<DropdownItem value="IM">Isle of Man</DropdownItem>
			<DropdownItem value="IL">Israel</DropdownItem>
			<DropdownItem value="IT">Italy</DropdownItem>
			<DropdownItem value="JM">Jamaica</DropdownItem>
			<DropdownItem value="JP">Japan</DropdownItem>
			<DropdownItem value="JE">Jersey</DropdownItem>
			<DropdownItem value="JO">Jordan</DropdownItem>
			<DropdownItem value="KZ">Kazakhstan</DropdownItem>
			<DropdownItem value="KE">Kenya</DropdownItem>
			<DropdownItem value="KI">Kiribati</DropdownItem>
			<DropdownItem value="XK">Kosovo</DropdownItem>
			<DropdownItem value="KW">Kuwait</DropdownItem>
			<DropdownItem value="KG">Kyrgyzstan</DropdownItem>
			<DropdownItem value="LA">Laos</DropdownItem>
			<DropdownItem value="LV">Latvia</DropdownItem>
			<DropdownItem value="LB">Lebanon</DropdownItem>
			<DropdownItem value="LS">Lesotho</DropdownItem>
			<DropdownItem value="LR">Liberia</DropdownItem>
			<DropdownItem value="LY">Libya</DropdownItem>
			<DropdownItem value="LI">Liechtenstein</DropdownItem>
			<DropdownItem value="LT">Lithuania</DropdownItem>
			<DropdownItem value="LU">Luxembourg</DropdownItem>
			<DropdownItem value="MO">Macao</DropdownItem>
			<DropdownItem value="MG">Madagascar</DropdownItem>
			<DropdownItem value="MW">Malawi</DropdownItem>
			<DropdownItem value="MY">Malaysia</DropdownItem>
			<DropdownItem value="MV">Maldives</DropdownItem>
			<DropdownItem value="ML">Mali</DropdownItem>
			<DropdownItem value="MT">Malta</DropdownItem>
			<DropdownItem value="MH">Marshall Islands</DropdownItem>
			<DropdownItem value="MQ">Martinique</DropdownItem>
			<DropdownItem value="MR">Mauritania</DropdownItem>
			<DropdownItem value="MU">Mauritius</DropdownItem>
			<DropdownItem value="YT">Mayotte</DropdownItem>
			<DropdownItem value="MX">Mexico</DropdownItem>
			<DropdownItem value="FM">Micronesia</DropdownItem>
			<DropdownItem value="MD">Moldova</DropdownItem>
			<DropdownItem value="MC">Monaco</DropdownItem>
			<DropdownItem value="MN">Mongolia</DropdownItem>
			<DropdownItem value="ME">Montenegro</DropdownItem>
			<DropdownItem value="MS">Montserrat</DropdownItem>
			<DropdownItem value="MA">Morocco</DropdownItem>
			<DropdownItem value="MZ">Mozambique</DropdownItem>
			<DropdownItem value="MM">Myanmar (Burma)</DropdownItem>
			<DropdownItem value="NA">Namibia</DropdownItem>
			<DropdownItem value="NR">Nauru</DropdownItem>
			<DropdownItem value="NP">Nepal</DropdownItem>
			<DropdownItem value="NL">Netherlands</DropdownItem>
			<DropdownItem value="NC">New Caledonia</DropdownItem>
			<DropdownItem value="NZ">New Zealand</DropdownItem>
			<DropdownItem value="NI">Nicaragua</DropdownItem>
			<DropdownItem value="NE">Niger</DropdownItem>
			<DropdownItem value="NG">Nigeria</DropdownItem>
			<DropdownItem value="NU">Niue</DropdownItem>
			<DropdownItem value="NF">Norfolk Island</DropdownItem>
			<DropdownItem value="KP">North Korea</DropdownItem>
			<DropdownItem value="MK">North Macedonia</DropdownItem>
			<DropdownItem value="MP">Northern Mariana Islands</DropdownItem>
			<DropdownItem value="NO">Norway</DropdownItem>
			<DropdownItem value="OM">Oman</DropdownItem>
			<DropdownItem value="PK">Pakistan</DropdownItem>
			<DropdownItem value="PW">Palau</DropdownItem>
			<DropdownItem value="PS">Palestine</DropdownItem>
			<DropdownItem value="PA">Panama</DropdownItem>
			<DropdownItem value="PG">Papua New Guinea</DropdownItem>
			<DropdownItem value="PY">Paraguay</DropdownItem>
			<DropdownItem value="PE">Peru</DropdownItem>
			<DropdownItem value="PH">Philippines</DropdownItem>
			<DropdownItem value="PN">Pitcairn Islands</DropdownItem>
			<DropdownItem value="PL">Poland</DropdownItem>
			<DropdownItem value="PT">Portugal</DropdownItem>
			<DropdownItem value="PR">Puerto Rico</DropdownItem>
			<DropdownItem value="QA">Qatar</DropdownItem>
			<DropdownItem value="RE">Réunion</DropdownItem>
			<DropdownItem value="RO">Romania</DropdownItem>
			<DropdownItem value="RU">Russia</DropdownItem>
			<DropdownItem value="RW">Rwanda</DropdownItem>
			<DropdownItem value="WS">Samoa</DropdownItem>
			<DropdownItem value="SM">San Marino</DropdownItem>
			<DropdownItem value="ST">São Tomé &amp; Príncipe</DropdownItem>
			<DropdownItem value="SA">Saudi Arabia</DropdownItem>
			<DropdownItem value="SN">Senegal</DropdownItem>
			<DropdownItem value="RS">Serbia</DropdownItem>
			<DropdownItem value="SC">Seychelles</DropdownItem>
			<DropdownItem value="SL">Sierra Leone</DropdownItem>
			<DropdownItem value="SG">Singapore</DropdownItem>
			<DropdownItem value="SX">Sint Maarten</DropdownItem>
			<DropdownItem value="SK">Slovakia</DropdownItem>
			<DropdownItem value="SI">Slovenia</DropdownItem>
			<DropdownItem value="SB">Solomon Islands</DropdownItem>
			<DropdownItem value="SO">Somalia</DropdownItem>
			<DropdownItem value="ZA">South Africa</DropdownItem>
			<DropdownItem value="GS">South Georgia &amp; South Sandwich Islands</DropdownItem>
			<DropdownItem value="KR">South Korea</DropdownItem>
			<DropdownItem value="SS">South Sudan</DropdownItem>
			<DropdownItem value="ES">Spain</DropdownItem>
			<DropdownItem value="LK">Sri Lanka</DropdownItem>
			<DropdownItem value="BL">St Barthélemy</DropdownItem>
			<DropdownItem value="SH">St Helena</DropdownItem>
			<DropdownItem value="KN">St Kitts &amp; Nevis</DropdownItem>
			<DropdownItem value="LC">St Lucia</DropdownItem>
			<DropdownItem value="MF">St Martin</DropdownItem>
			<DropdownItem value="PM">St Pierre &amp; Miquelon</DropdownItem>
			<DropdownItem value="VC">St Vincent &amp; Grenadines</DropdownItem>
			<DropdownItem value="SR">Suriname</DropdownItem>
			<DropdownItem value="SJ">Svalbard &amp; Jan Mayen</DropdownItem>
			<DropdownItem value="SE">Sweden</DropdownItem>
			<DropdownItem value="CH">Switzerland</DropdownItem>
			<DropdownItem value="TW">Taiwan</DropdownItem>
			<DropdownItem value="TJ">Tajikistan</DropdownItem>
			<DropdownItem value="TZ">Tanzania</DropdownItem>
			<DropdownItem value="TH">Thailand</DropdownItem>
			<DropdownItem value="TL">Timor-Leste</DropdownItem>
			<DropdownItem value="TG">Togo</DropdownItem>
			<DropdownItem value="TK">Tokelau</DropdownItem>
			<DropdownItem value="TO">Tonga</DropdownItem>
			<DropdownItem value="TT">Trinidad &amp; Tobago</DropdownItem>
			<DropdownItem value="TA">Tristan da Cunha</DropdownItem>
			<DropdownItem value="TN">Tunisia</DropdownItem>
			<DropdownItem value="TR">Turkey</DropdownItem>
			<DropdownItem value="TM">Turkmenistan</DropdownItem>
			<DropdownItem value="TC">Turks &amp; Caicos Islands</DropdownItem>
			<DropdownItem value="TV">Tuvalu</DropdownItem>
			<DropdownItem value="UG">Uganda</DropdownItem>
			<DropdownItem value="UA">Ukraine</DropdownItem>
			<DropdownItem value="AE">United Arab Emirates</DropdownItem>
			<DropdownItem value="GB">United Kingdom</DropdownItem>
			<DropdownItem value="US">United States</DropdownItem>
			<DropdownItem value="UY">Uruguay</DropdownItem>
			<DropdownItem value="UM">US Outlying Islands</DropdownItem>
			<DropdownItem value="VI">US Virgin Islands</DropdownItem>
			<DropdownItem value="UZ">Uzbekistan</DropdownItem>
			<DropdownItem value="VU">Vanuatu</DropdownItem>
			<DropdownItem value="VA">Vatican City</DropdownItem>
			<DropdownItem value="VE">Venezuela</DropdownItem>
			<DropdownItem value="VN">Vietnam</DropdownItem>
			<DropdownItem value="WF">Wallis &amp; Futuna</DropdownItem>
			<DropdownItem value="EH">Western Sahara</DropdownItem>
			<DropdownItem value="YE">Yemen</DropdownItem>
			<DropdownItem value="ZM">Zambia</DropdownItem>
			<DropdownItem value="ZW">Zimbabwe</DropdownItem>
		</Dropdown>
	</form>
</address>
