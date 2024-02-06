<script lang="ts">
	import { collectionValue, mode } from '@src/stores/store';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import Header from '@src/components/Header.svelte';
	import { collections, collection, contentLanguage } from '@src/stores/load';
	import { page } from '$app/stores';

	import { goto } from '$app/navigation';
	import type { Schema } from '@src/collections/types';
	import { onDestroy } from 'svelte';
	let ForwardBackward: boolean = false; // if using browser history
	collection.set($collections.find((x) => x.name === $page.params.collection) as Schema); // current collection
	globalThis.onpopstate = async () => {
		ForwardBackward = true;
		collection.set($collections.find((x) => x.name === $page.params.collection) as Schema);
	};
	let unsubscribe = collection.subscribe((_) => {
		$collectionValue = {};
		if (!ForwardBackward) {
			goto(`/${$contentLanguage}/${$collection.name}`);
		}
		ForwardBackward = false;
	});
	onDestroy(() => {
		unsubscribe();
	});
	contentLanguage.subscribe((_) => {
		if (!ForwardBackward) {
			goto(`/${$contentLanguage}/${$collection.name}`);
		}
	});
</script>

<div class="flex max-md:flex-wrap h-screen">
	<Drawer />
	<div class="flex-grow-[2] overflow-hidden max-h-screen pl-[2px] pr-[4px]">
		{#if $mode == 'view' || $mode == 'modify'}
			<Header />
			<EntryList />
		{:else if ['edit', 'create'].includes($mode)}
			<Header />
			<div class="overflow-y-auto fields">
				<Fields />
			</div>
		{/if}
	</div>
	{#if ['edit', 'create'].includes($mode)}
		<ControlPanel />
	{/if}
</div>

<style>
	.fields {
		max-height: calc(100% - 60px);
	}
</style>
