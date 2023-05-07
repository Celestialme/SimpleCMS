<script lang="ts">
	import { collectionValue, mode } from '@src/stores/store';
	import { credentials } from '@src/stores/load';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import collections, { collection } from '@src/collections';
	import type { LayoutServerData } from '../../$types';
	import { page } from '$app/stores';
	import type { Schema } from '@src/collections/types';
	export let data: LayoutServerData;
	collection.set(collections.find((x) => x.name === $page.params.collection) as Schema); // current collection
	console.log(data);
	credentials.set(data.credentials);

	collection.subscribe((_) => {
		$collectionValue = {};
		globalThis.history.pushState({}, '', `/${$page.params.language}/${$collection.name}`);
	});
</script>

<div class="flex">
	<Drawer />
	<div class="flex-grow overflow-auto max-h-screen">
		{#if $mode == 'view' || $mode == 'delete'}
			<EntryList />
		{:else if ['edit', 'create'].includes($mode)}
			<Fields />
		{/if}
	</div>
	<ControlPanel />
</div>
