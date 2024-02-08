<script lang="ts">
	import { collectionValue, drawerExpanded, mode } from '@src/stores/store';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import Header from '@src/components/Header.svelte';
	import { collections, collection, contentLanguage } from '@src/stores/load';
	import { page } from '$app/stores';
	import Collections from '@src/components/system/drawer/Collections.svelte';
	import { goto } from '$app/navigation';
	import type { Schema } from '@src/collections/types';
	import { onDestroy } from 'svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import axios from 'axios';
	import FloatingNav from '@src/components/system/FloatingNav.svelte';
	let ForwardBackward: boolean = false; // if using browser history
	collection.set($collections.find((x) => x.name === $page.params.collection) as Schema); // current collection
	globalThis.onpopstate = async () => {
		ForwardBackward = true;
		collection.set($collections.find((x) => x.name === $page.params.collection) as Schema);
	};
	let navButton;
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
	async function signOut() {
		let resp = (
			await axios.post(
				`/api/auth`,
				{ authType: 'signOut' },
				{
					headers: {
						'content-type': 'multipart/form-data'
					}
				}
			)
		).data;
		if (resp.status == 200) {
			goto(`/login`);
		}
	}
</script>

<div class="flex max-md:flex-wrap h-screen">
	<Drawer>
		<section>
			<Collections />
		</section>

		<section class="mt-auto text-center">
			<Button class="max-w-full" on:click={signOut}>
				{#if $drawerExpanded}
					SignOut
				{:else}
					<iconify-icon icon="charm:sign-out"></iconify-icon>
				{/if}
			</Button>
		</section>
		<div class:max-md:hidden={!$drawerExpanded && navButton.x == navButton.radius}>
			<FloatingNav bind:buttonInfo={navButton} />
		</div>
	</Drawer>
	<div class="flex-grow-[2] overflow-hidden max-h-screen pl-[2px] pr-[4px]">
		{#if $mode == 'view' || $mode == 'modify'}
			<Header />
			<EntryList />
		{:else if ['edit', 'create'].includes($mode)}
			<Header />
			<div class="overflow-y-auto fields max-h-[calc(100vh-60px)] max-md:max-h-[calc(100vh-120px)]">
				<Fields />
			</div>
		{/if}
	</div>
	{#if ['edit', 'create'].includes($mode)}
		<ControlPanel />
	{/if}
</div>
