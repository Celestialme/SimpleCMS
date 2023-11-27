<script lang="ts">
	import { collectionValue, mode } from '@src/stores/store';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import Header from '@src/components/Header.svelte';
	import { collections, collection } from '@src/stores/load';
	import { page } from '$app/stores';
	import type { Schema } from '@src/collections/types';
	import { goto } from '$app/navigation';
	let ForwardBackward: boolean = false; // if using browser history
	collection.set($collections.find((x) => x.name === $page.params.collection) as Schema); // current collection
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
	<div class="flex-grow overflow-hidden max-h-screen pl-[2px] pr-[4px]">
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
		min-width: 200px;
	}
</style>
