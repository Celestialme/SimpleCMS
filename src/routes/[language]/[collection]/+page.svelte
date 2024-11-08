<script lang="ts">
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import Fields from '@src/components/Fields.svelte';
	import ControlPanel from '@src/components/ControlPanel.svelte';
	import EntryList from '@src/components/EntryList.svelte';
	import Header from '@src/components/Header.svelte';
	import { collections, collection, categories } from '@src/stores/load';
	import { contentLanguage, drawerExpanded, mode, collectionValue } from '@src/stores/store.svelte';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	import type { Schema } from '@src/collections/types';
	import { onDestroy } from 'svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import axios from 'axios';
	import FloatingNav from '@src/components/system/FloatingNav.svelte';
	import Media from '@src/components/Media.svelte';
	import Categories from '@src/components/system/drawer/Categories.svelte';
	let ForwardBackward: boolean = false; // if using browser history
	collection.set($collections[$page.params.collection as string] as Schema); // current collection

	globalThis.onpopstate = async () => {
		ForwardBackward = true;
		collection.set($collections[$page.params.collection as string] as Schema);
	};
	let navButton: any = $state();

	let unsubscribe = collection.subscribe((_) => {
		collectionValue.set({});
		if (!ForwardBackward) {
			goto(`/${contentLanguage()}/${$collection.path}`);
		}
		ForwardBackward = false;
	});
	onDestroy(() => {
		unsubscribe();
	});
	contentLanguage.subscribe((_) => {
		if (!ForwardBackward) {
			goto(`/${contentLanguage()}/${$collection.path}`);
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
		console.log(resp);
		if (resp.status == 200) {
			goto(`/login`);
		}
	}
</script>

<div class="flex max-md:flex-wrap h-screen">
	<Drawer>
		<section>
			{#if $categories}
				<Categories />
			{/if}
		</section>
		<section class="text-center">
			<button onclick={() => mode.set('storage')} class="p-2 bg-[#353b63] text-white w-full">
				Storage
			</button>
		</section>
		<section class="mt-auto text-center">
			<Button class="max-w-full" on:click={signOut}>
				{#if drawerExpanded()}
					SignOut
				{:else}
					<iconify-icon icon="charm:sign-out"></iconify-icon>
				{/if}
			</Button>
		</section>

		<div class:max-md:hidden={!drawerExpanded() && navButton.x == navButton.radius}>
			<FloatingNav bind:buttonInfo={navButton} />
		</div>
	</Drawer>
	<div class="flex-grow-[2] overflow-hidden max-h-screen pl-[2px] pr-[4px]">
		{#if mode() !== 'storage'}
			<Header />
		{/if}
		{#if mode() == 'view' || mode() == 'modify'}
			<EntryList />
		{:else if ['edit', 'create'].includes(mode())}
			<div
				id="fields_container"
				class="overflow-y-auto fields max-h-[calc(100vh-60px)] max-md:max-h-[calc(100vh-120px)]"
			>
				<Fields />
			</div>
		{:else if mode() == 'storage'}
			<Media />
		{/if}
	</div>
	{#if ['edit', 'create'].includes(mode())}
		<ControlPanel />
	{/if}
</div>
