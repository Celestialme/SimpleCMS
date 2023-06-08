<script lang="ts">
	// Collection Creation
	import { TabGroup, Tab, Autocomplete, popup, Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption, PopupSettings, ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { flip } from 'svelte/animate';
	import { dndzone } from 'svelte-dnd-action';

	import * as widgets from '@src/components/widgets/index';
	import axios from 'axios';

	// Json export
	function onCompleteHandler(e: Event): void {
		// Create an object containing the values of the collection builder
		const data = {
			name,
			DBName,
			icon,
			iconselected,
			slug,
			selectedWidget,
			selectedWidgetoptions
		};

		// Log the data object to the console
		console.log(data);

		// Convert the data object to a JSON string
		const json = JSON.stringify(data);

		// Create a Blob object from the JSON string
		const blob = new Blob([json], { type: 'application/json' });

		// Create a URL for the Blob object
		const url = URL.createObjectURL(blob);

		// Create a link element and set its href attribute to the URL of the Blob object
		const link = document.createElement('a');
		link.href = url;
		link.download = 'collection.json';

		// Append the link element to the document body and click it to trigger the download
		document.body.appendChild(link);
		link.click();

		// Remove the link element from the document body
		document.body.removeChild(link);
	}

	let lockedName: boolean = true;
	let lockedWidget: boolean = true;

	function checkInputName() {
		if (name) {
			lockedName = false;
		} else {
			lockedName = true;
		}
	}

	function checkInputWidget() {
		if (inputPopupWidgets) {
			lockedWidget = false;
		} else {
			lockedWidget = true;
		}
	}

	let tabSet: number = 0;

	let name = '';
	let DBName = '';
	let description = '';
	let icon: any = '';
	let status = 'unpublished';
	const statuses = ['published', 'unpublished', 'draft', 'schedule', 'cloned'];
	let slug = '';
	let autoUpdateSlug = true;

	$: {
		// Update DBName  lowercase and replace Spaces
		DBName = name.toLowerCase().replace(/ /g, '_');

		// Automatically update slug when name changes
		if (autoUpdateSlug) {
			slug = name.toLowerCase().replace(/\s+/g, '_');
		}
	}

	// Stop automatically updating slug when user manually edits it
	function onSlugInput() {
		autoUpdateSlug = false;
	}

	// -------------iconfy icons list----------------
	// Import loadIcons function from Iconify Svelte library
	import { loadIcons } from '@iconify/svelte';
	import { language } from '@src/stores/store';

	let icons = []; // array of icon names
	let iconselected: any = '';
	let loading = false; // loading state
	let searchQuery = '';

	// icon popup
	const popupIcon: PopupSettings = {
		event: 'click',
		target: 'popupIcon',
		placement: 'bottom',
		closeQuery: '' // prevent any element inside the popup from closing it
	};

	// function to fetch icons from Iconify API
	async function searchIcons(query: string) {
		loading = true;
		try {
			// Use search API query with prefix and limit parameters
			// Use prefix=ic to filter by Google Material icon set
			// Use start variable to specify the start index of the result
			const response = await axios.get(
				`https://api.iconify.design/search?query=${encodeURIComponent(searchQuery)}&prefix=ic&limit=50&start=${start}`
			);
			console.log('response', response);
			if (response.data && response.data.icons) {
				icons = response.data.icons; // update icons array
				console.log('icons', icons);

				// Use loadIcons function to preload icons from API
				loadIcons(icons.map((icon) => `${response.data.prefix}:${icon}`));
			}
		} catch (error) {
			// Display error message
			console.error('An error occurred while fetching icons:', error);
		}
		loading = false;
	}

	// function to select an icon
	function selectIcon(icon: string) {
		iconselected = icon; // update selected icon name
		// TODO : close the popup
	}

	// reactive statement to update selected icon name on click
	$: if (iconselected) {
		console.log(`Selected icon: ${iconselected}`);
	}

	// Declare a variable for the start index and initialize it to 0
	let start = 0;

	// Reactive statement to fetch icons whenever the start index changes
	$: if (start >= 0) {
		searchIcons(searchQuery);
	}

	// Function to go to the next page of results by increasing the start index by 50
	function nextPage() {
		start += 50;
	}

	// Function to go to the previous page of results by decreasing the start index by 50
	function prevPage() {
		start -= 50;
	}

	// ------------widget builder ---------------

	// create an array to store the input values for each widget
	let inputPopupWidgets = [''];
	let popupSettings: PopupSettings = {
		event: 'focus-click',
		closeQuery: '',
		target: 'popupAutocomplete',
		placement: 'bottom'
	};

	const widgetList = Object.values(widgets);
	const widgetOptions: AutocompleteOption[] = Object.keys(widgetList[0]).map((widget) => {
		return {
			label: widget,
			value: widget
		};
	});

	let selectedWidget = '';
	let selectedWidgets = [{ widget: null, options: {}, input: '' }];
	let selectedWidgetoptions = {};

	// create a function to add a widget and push a new input value to the array
	function onAddWidgetClick() {
		modalStore.trigger(modal);
		selectedWidgets = [...selectedWidgets, { widget: null, options: {}, input: '' }];
		inputPopupWidgets.push('');
	}

	const modal: ModalSettings = {
		type: 'confirm',
		// Data
		title: 'Please Confirm',
		body: 'Are you sure you wish to proceed?',
		// TRUE if confirm pressed, FALSE if cancel pressed
		response: (r: boolean) => console.log('response:', r)
	};

	// create a function to handle the selection of a widget and update the input value in the array
	function onPopupWidgetSelect(event: CustomEvent<AutocompleteOption>, index: number) {
		// check if inputPopupWidgets is an empty string and use an empty array as the default value
		inputPopupWidgets = inputPopupWidgets || [];
		inputPopupWidgets[index] = event.detail.label;
		const widgetName = event.detail.value;
		selectedWidgets[index].widget = widgetName;
		selectedWidgets[index].input = '';
		// use widgetName as the index type
		selectedWidgetoptions[widgetName[index]] = {};
	}
</script>

<div class="m-2">
	<h2 class="h2">Collection Builder <iconify-icon icon="dashicons:welcome-widgets-menus" width="24" /></h2>
	<p>This builder will help you to setup a new Content Collection</p>
	<div>how todo translations?</div>

	<TabGroup on:complete={onCompleteHandler}>
		<Tab bind:group={tabSet} name="tab1" value={0}>
			<iconify-icon icon="ic:baseline-edit" width="24" class="text-primary-500" />
			Edit</Tab
		>
		<Tab bind:group={tabSet} name="tab2" value={1}>
			<iconify-icon icon="mdi:widgets-outline" width="24" class="text-primary-500" />
			Manage Fields</Tab
		>
		<Tab bind:group={tabSet} name="tab3" value={2}>
			<iconify-icon icon="ic:twotone-shield" width="24" class="text-primary-500" />
			Manage Permisions</Tab
		>

		<!-- Tab Panels --->

		<svelte:fragment slot="panel">
			<!-- Edit -->
			{#if tabSet === 0}
				<div class="text-center text-xs text-error-500">* Required</div>

				<!-- Collection Name -->
				<div class=" mb-4 ml-1.5 flex items-center gap-4">
					<label class="relative"
						>Name: <span class="text-error-500">*</span>
						<iconify-icon icon="material-symbols:info" width="18" class="absolute -top-3 right-2" />
					</label>

					<input
						type="text"
						required
						id="name"
						bind:value={name}
						on:input={checkInputName}
						placeholder="Collection Unique Name"
						class="variant-filled-surface"
					/>
					{#if name}
						<p>Database Name: <span class="font-bold">{DBName}</span></p>
					{/if}
				</div>

				<div class="border p-2">
					<p class="mb-2 font-bold">Optional values:</p>

					<!-- Collection Description -->
					<div class="mb-3 flex items-center gap-4">
						<label class="relative">Description: </label>

						<textarea
							id="description"
							rows="2"
							cols="50"
							bind:value={description}
							placeholder="Describe your Collection"
							class="variant-filled-surface"
						/>
					</div>

					<!-- iconify icon -->
					<div class="mb-4 flex items-center gap-4">
						<label class="">Icon: <iconify-icon icon="material-symbols:info" width="18" class="absolute -top-3 right-1" /></label>
						<input
							type="text"
							id="icon"
							bind:value={searchQuery}
							placeholder="Search for an icon..."
							class="variant-filled-surface"
							use:popup={popupIcon}
							on:input={searchIcons}
						/>

						<!-- Display selected icon -->
						{#if iconselected}
							<div class="flex items-center justify-center gap-4 border p-1">
								<!-- todo: display icon.name -->
								<iconify-icon icon={iconselected} width="30" class="text-primary-500" />
								<p>Name: <span class="text-primary-500">{iconselected}</span></p>
							</div>
						{/if}
					</div>

					<!-- icon popup -->
					<div class="card z-10 w-96 p-4 shadow-xl" data-popup="popupIcon">
						<div>
							<div class=" mb-2 border-b text-center">
								<p class="text-primary-500">Select from Google Material Icons</p>
								<!-- todo: display hover  -->
								<iconify-icon {icon} width="30" class="text-error-500" />
							</div>
							<div class="grid grid-cols-5 gap-2">
								{#each icons as icon}
									<div class="relative flex flex-col items-center">
										<span class="iconify" data-icon={icon} data-inline="false" />
										<iconify-icon {icon} width="24" on:click={() => selectIcon(icon)} class="hover:cursor-pointer hover:text-primary-500" />
									</div>
								{/each}
							</div>

							<!-- Add buttons for pagination -->
							<!-- TODO Button Click will close popup -->
							<div class="mt-6 flex justify-between">
								<!-- Disable the previous button if the start index is zero -->
								<button disabled={start === 0} on:click={prevPage} class="btn btn-sm variant-filled-primary">Previous</button>
								<!-- Disable the next button if there are less than 50 icons in the current page -->
								<button disabled={icons.length < 50} on:click={nextPage} class="btn btn-sm variant-filled-primary">Next</button>
							</div>
						</div>
						<div class="arrow bg-surface-100-800-token" />
					</div>

					<!-- status -->
					<div class="mb-4 flex items-center gap-4">
						<label class="relative" for="status">
							Status:
							<iconify-icon icon="material-symbols:info" width="18" class="absolute -top-3 right-1" />
						</label>
						<select id="status" bind:value={status} class="variant-filled-surface w-52">
							{#each statuses as statusOption}
								<option value={statusOption} class="">{statusOption}</option>
							{/each}
						</select>
					</div>

					<!-- slug -->
					<div class="mb-4 flex items-center gap-4">
						<label class="relative">
							Slug:
							<iconify-icon icon="material-symbols:info" width="18" class="absolute -top-3 right-1" />
						</label>
						<input
							type="text"
							id="slug"
							bind:value={slug}
							placeholder="Path for collection..."
							class="variant-filled-surface"
							on:input={onSlugInput}
						/>
					</div>
				</div>

				<!-- Manage Fields -->
			{:else if tabSet === 1}
				<h2>
					<iconify-icon icon={iconselected} width="24" class="mr-1" /><span class="text-primary-500">{name}:</span>
					Field Widgets Overview
				</h2>
				<div class="bg-surface-500 text-center">
					<p>Select as many widget inputs as you required to create you Collection Content Type</p>
					<p>Drag & Drop your widget to sort these</p>

					<!-- Responsive Container (recommended) -->
					<div class="table-container">
						<!-- Native Table Element -->
						<table class="table-hover table text-left">
							<thead>
								<tr>
									<th>Position</th>
									<th>Name</th>
									<th>DBName</th>
									<th>Widget</th>
									<td>Operations</td>
								</tr>
							</thead>
							<tbody>
								<tr>
									<td>1</td>
									<td>First</td>
									<td>textFrist</td>
									<td>Text</td>
									<td>edit</td>
								</tr>
								<tr>
									<td>2</td>
									<td>Middle</td>
									<td>Text</td>
									<td>edit</td>
								</tr>
								<tr>
									<td>3</td>
									<td>Last</td>
									<td>Text</td>
									<td>edit</td>
								</tr>
							</tbody>
						</table>
					</div>

					<div class="text-center">
						<button class="btn variant-filled-primary my-3" on:click={onAddWidgetClick}>Add more Fields</button>
					</div>
				</div>

				<!-- Manage Permisions -->
			{:else if tabSet === 2}
				(tab panel 3 contents)
			{/if}
		</svelte:fragment>
	</TabGroup>
</div>

<Modal>
	{#each selectedWidgets as selectedWidget, index}
		<input
			class="autocomplete input"
			type="search"
			name="autocomplete-search"
			bind:value={inputPopupWidgets[index]}
			use:popup={popupSettings}
			placeholder="Select Widget..."
		/>
		<div data-popup="popupAutocomplete" class="w-full bg-surface-500 text-white">
			<Autocomplete bind:input={inputPopupWidgets[index]} options={widgetOptions} on:selection={(event) => onPopupWidgetSelect(event, index)} />
		</div>

		{#if selectedWidget.widget}
			<div class="mb-2 border-y text-center text-primary-500">
				<div class="text-xl text-primary-500"><span class="font-bold">{selectedWidget.widget}</span> Widget Input Options</div>
				<div class="text-xs text-error-500">* Required</div>
			</div>
			<div class="options-table">
				{#each Object.keys(widgetList[0][selectedWidgets[index].widget]({})).filter((key) => key !== 'widget' && key !== 'display' && key !== 'schema') as option}
					{#if option === 'label'}
						<label>{option}: <span class="text-error-500">*</span></label>
						<input
							type="text"
							required
							name={option}
							id={option}
							placeholder={`Enter ${option}`}
							class="variant-filled-surface"
							bind:value={selectedWidgetoptions[option]}
							on:input={checkInputWidget}
						/>
					{:else}
						<label>{option}:</label>

						{#if option === 'minlength' || option === 'maxlength' || option === 'count'}
							<input
								type="number"
								name={option}
								id={option}
								placeholder={`Enter ${option}`}
								class="variant-filled-surface"
								bind:value={selectedWidgetoptions[option]}
							/>
						{:else if option === 'required' || option === 'readonly' || option === 'disabled' || option === 'localization'}
							<input type="checkbox" name={option} id={option} class="variant-filled-surface" bind:value={selectedWidgetoptions[option]} />
						{:else}
							<input
								type="text"
								name={option}
								id={option}
								placeholder={`Enter ${option}`}
								class="variant-filled-surface"
								bind:value={selectedWidgetoptions[option]}
							/>
						{/if}
					{/if}
				{/each}
			</div>
			<div class="text-center">
				<button class="btn variant-filled-primary my-3" on:click={onAddWidgetClick}>Add Another Widget Input</button>
			</div>
		{/if}
	{/each}</Modal
>

<style>
	.options-table {
		display: grid;
		grid-template-columns: max-content 1fr;
		gap: 1rem;
	}
	.options-table label {
		text-transform: capitalize;
	}
	.options-table input[type='text'],
	.options-table input[type='number'] {
		max-width: 24rem;
	}

	label {
		min-width: 100px;
	}
</style>
