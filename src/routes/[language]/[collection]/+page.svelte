<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import collections, { collection } from '@src/collections';
	import { collectionValue, mode } from '@src/stores/store';
	import type { Schema } from '@src/collections/types';
	import type { LayoutServerData } from '../$types';
	import { user } from '@src/stores/store';

	import Fields from '@src/components/Fields.svelte';
	import EntryList from '@src/components/EntryList.svelte';

	export let data: LayoutServerData;

	console.log(data);

	// Set the value of the collection store to the collection object from the collections array that has a name property that matches the current page's collection parameter
	collection.set($collections.find((x) => x.name === $page.params.collection) as Schema); // current collection

	// Set the value of the credentials store to the user property of the data variable
	user.set(data.user);
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
