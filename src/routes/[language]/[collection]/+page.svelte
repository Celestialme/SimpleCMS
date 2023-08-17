<script lang="ts">
	import { collectionValue, mode } from '@src/stores/store';
	import { user } from '@src/stores/load';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import collections, { collection } from '@src/collections';
	import type { LayoutServerData } from '../$types';
	import { page } from '$app/stores';
	import type { Schema } from '@src/collections/types';
	import { goto } from '$app/navigation';
	export let data: LayoutServerData;
	let ForwardBackward: boolean = false; // if using browser history
	collections.subscribe((s) => {
		if (s.length > 0 && $page?.params?.collection) collection.set($collections.find((x) => x.name === $page.params.collection) as Schema); // current collection
	});
	console.log(data);
	user.set(data.user);
	globalThis.onpopstate = async () => {
		ForwardBackward = true;

		collection.set($collections.find((x) => x.name === $page.params.collection) as Schema);
	};
	collection.subscribe((_) => {
		$collectionValue = {};
		if (!ForwardBackward) {
			goto(`/${$page.params.language}/${$collection.name}`);
		}
		ForwardBackward = false;
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
