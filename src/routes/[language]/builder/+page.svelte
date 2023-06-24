<script lang="ts">
	// Collection Creation
	import { TabGroup, Tab, Autocomplete, popup, Modal, modalStore } from '@skeletonlabs/skeleton';
	import type { AutocompleteOption, PopupSettings, ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import VerticalList from '@src/components/VerticalList.svelte';
	import IconifyPicker from '@src/components/IconifyPicker.svelte';

	import * as widgets from '@src/components/widgets/index';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';
	import { toggleLeftSidebar, language } from '@src/stores/store';

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
		console.log('JSONoutput', data);

		// Convert the datadata object to a JSON string
		//const json = JSON.stringify(datadata);

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
	let searchQuery = '';
	let icon: any = '';
	let iconselected: any = '';
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

	// ------------widget builder ---------------
	// create an array to store the input values for each widget
	let inputPopupWidgets = [''];
	console.log(inputPopupWidgets);
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
	// function onAddWidgetClick() {
	// 	// modalStore.trigger(modal);
	// 	selectedWidgets = [...selectedWidgets, { widget: null, options: {}, input: '' }];
	// 	inputPopupWidgets.push('');

	// 	console.log(selectedWidgets);
	// 	console.log(inputPopupWidgets);
	// }

	import ModalWidgetForm1 from './ModalWidgetForm1.svelte';
	import ModalWidgetForm2 from './ModalWidgetForm2.svelte';

	function onAddWidgetClick(): void {
		// create an array of the modals to open
		[1].forEach((dNum: number) => {
			const modal: ModalSettings = {
				type: 'prompt',
				// target: `ModalWidgetForm${dNum}`
				title: `Modal ${dNum}`,
				body: `The modal body of ${dNum}.`,
				value: 'Skeleton',
				valueAttr: { type: 'text', minlength: 3, maxlength: 10, required: true },
				// Returns the updated response value
				response: (r: string) => console.log('response:', r)
			};

			modalStore.trigger(modal);
		});
	}

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

	// TODO: Widget data
	let items = [
		{ id: 1, name: 'Item 1', DBName: 'item1', widget: 'Text' },
		{ id: 2, name: 'Item 2', DBName: 'item2', widget: 'Text2' },
		{ id: 3, name: 'Item 3', DBName: 'item3', widget: 'Text3' }
		// ...
	];
</script>

<div class="align-centre mb-2 ml-2 mt-2 flex dark:text-white">
	<div class="flex items-center justify-between">
		{#if $toggleLeftSidebar === true}
			<button type="button" on:keydown on:click={() => toggleLeftSidebar.update((value) => !value)} class="btn-icon variant-ghost-surface mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}
		<!-- Title  with icon -->
		<h1 class="{!$toggleLeftSidebar ? 'ml-2' : ''} h1 flex items-center gap-1">
			<iconify-icon icon="dashicons:welcome-widgets-menus" width="24" class="mr-1 text-error-500 sm:mr-2" /> Collection Builder
		</h1>
	</div>
</div>
<div class="m-2">
	<p class="mb-2 hidden text-center sm:block">This builder will help you to setup a new Content Collection</p>

	<TabGroup on:complete={onCompleteHandler}>
		<Tab bind:group={tabSet} name="tab1" value={0}>
			<div class="flex items-center gap-1">
				<iconify-icon icon="ic:baseline-edit" width="24" class="text-primary-500" />
				Edit
			</div></Tab
		>
		<Tab bind:group={tabSet} name="tab2" value={1}
			><div class="flex items-center gap-1">
				<iconify-icon icon="mdi:widgets-outline" width="24" class="text-primary-500" />
				Fields
			</div></Tab
		>
		<Tab bind:group={tabSet} name="tab3" value={2}
			><div class="flex items-center gap-1">
				<iconify-icon icon="ic:twotone-shield" width="24" class="text-primary-500" />
				Permisions
			</div></Tab
		>

		<!-- Tab Panels --->

		<svelte:fragment slot="panel">
			<!-- Edit -->
			{#if tabSet === 0}
				<div class="mb-2 text-center text-xs text-error-500">* Required</div>

				<!-- Collection Name -->
				<div class="mb-2 flex items-center gap-4 sm:mb-4 sm:ml-1.5">
					<label for="name" class="relative"
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
						class="variant-filled-surface ml-1.5 w-full sm:ml-0 sm:w-auto"
					/>
					{#if name}
						<p class="mb-3 hidden sm:block">Database Name: <span class="font-bold text-primary-500">{DBName}</span></p>
					{/if}
				</div>
				{#if name}
					<p class="mb-3 sm:hidden">Database Name: <span class="font-bold text-primary-500">{DBName}</span></p>
				{/if}

				<div class="rounded-md border p-2">
					<p class="mb-2 font-bold text-primary-500">Optional values:</p>

					<!-- Collection Description -->
					<div class="mb-3 flex items-center gap-4">
						<label for="description" class="relative">Description: </label>

						<textarea
							id="description"
							rows="2"
							cols="50"
							bind:value={description}
							placeholder="Describe your Collection"
							class="variant-filled-surface"
						/>
					</div>

					<!-- TODO: Pass icon iconselected values -->
					<!-- iconify icon chooser -->
					<IconifyPicker {searchQuery} {icon} {iconselected} />

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
						<label for="slug" class="relative">
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

				<div class="flex justify-between">
					<a href="/builder" class="btn variant-filled-secondary mt-2">Cancel</a>
					<button type="button" on:click={() => (tabSet = 1)} class="btn variant-filled-primary mt-2">Next</button>
				</div>

				<!-- Manage Fields -->
			{:else if tabSet === 1}
				<h2 class="mb-2 flex items-center">
					<p>Field field for :</p>
					<iconify-icon icon={iconselected} width="24" class="mx-1 text-primary-500" />
					<div class="text-primary-500">{name}</div>
				</h2>
				<div class="variant-outline-primary rounded-t-md p-2 text-center">
					<p>Select as many widget inputs as you require to create your Collection</p>
					<p class="mb-2">Drag & Drop your widgets fields to sort them</p>
				</div>

				<!--dnd vertical row -->
				<VerticalList {items} />

				<div class=" border-t text-center border-surface-400-500-token">
					<button class="btn variant-filled-tertiary mt-2" on:keydown on:click={onAddWidgetClick}>Add more Fields</button>
				</div>
				<div class=" flex items-center justify-between">
					<button type="button" on:click={() => (tabSet = 0)} class="btn variant-filled-secondary mt-2 justify-end">Previous</button>
					<button type="button" on:click={onCompleteHandler} class="btn variant-filled-primary mt-2 justify-end dark:text-black">Save</button>
				</div>

				<!-- Manage Permissions -->
			{:else if tabSet === 2}
				only if required (tab panel 3 contents)
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
						<label for={option}>{option}: <span class="text-error-500">*</span></label>
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
						<label for={option}>{option}:</label>

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
				<button class="btn variant-filled-primary my-3" on:keydown on:click={onAddWidgetClick}>Add Another Widget Input</button>
			</div>
		{/if}
	{/each}
</Modal>

<style lang="postcss">
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
