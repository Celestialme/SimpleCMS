<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import collections, { collection } from '@src/collections';
	import { collectionValue, mode } from '@src/stores/store';
	import type { Schema } from '@src/collections/types';
	import type { LayoutServerData } from '../$types';
	import { credentials } from '@src/stores/store';
	import Fields from '@src/components/Fields.svelte';
	import EntryList from '@src/components/EntryList.svelte';

	export let data: LayoutServerData;

	// Declare a ForwardBackward variable to track whether the user is navigating using the browser's forward or backward buttons
	let ForwardBackward: boolean = false;

	// Set the value of the collection store to the collection object from the collections array that has a name property that matches the current page's collection parameter
	collection.set(collections.find((x) => x.name === $page.params.collection) as Schema);

	//console.log(data);

	// Set the value of the credentials store to the credentials property of the data variable
	credentials.set(data.credentials);

	globalThis.onpopstate = async () => {
		// Set up an event listener for the popstate event
		ForwardBackward = true; // Set ForwardBackward to true to indicate that the user is navigating using the browser's forward or backward buttons

		// Update the value of the collection store based on the current page's collection parameter
		collection.set(collections.find((x) => x.name === $page.params.collection) as Schema);
	};

	// Subscribe to changes in the collection store
	collection.subscribe((_) => {
		// Reset the value of the collectionValue store
		$collectionValue = {};
		// Check if the current route is a collection route
		const isCollectionRoute = collections.some((x) => x.name === $page.params.collection);

		if (!ForwardBackward && isCollectionRoute) {
			// If ForwardBackward is false and the current route is a collection route
			goto(`/${$page.params.language}/${$collection.name}`); // Update the page's URL to include the current collection's name
		}
		// Reset ForwardBackward to false
		ForwardBackward = false;
	});
</script>

<div class="flex">
	<div class="max-h-screen flex-grow overflow-auto">
		{#if $mode == 'view' || $mode == 'delete'}
			<EntryList />
		{:else if ['edit', 'create'].includes($mode)}
			<Fields />
		{/if}
	</div>
</div>
