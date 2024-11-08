<script lang="ts">
	import 'iconify-icon';

	import { collection } from '@src/stores/load';
	import axios from 'axios';
	import { obj2formData } from '@src/utils/utils';
	import WidgetBuilder from './WidgetBuilder.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import FloatingNav from '@src/components/system/FloatingNav.svelte';
	import Header from './Header.svelte';
	import { onDestroy } from 'svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	import PermissionsTable from '@src/components/PermissionsTable.svelte';
	import { defaultPermissions, permissions, type Permissions } from '@src/collections/types';
	import Categories from '@src/components/system/drawer/Categories.svelte';
	import { mode, drawerExpanded } from '@src/stores/store.svelte';
	let collectionName = mode.value == 'edit' ? $collection.path : '';
	let icon = mode.value == 'edit' ? $collection.icon : '';
	let permissionsValue: Permissions;
	let tabs = ['Core', 'Permissions', 'Fields'] as const;
	let currentTab: (typeof tabs)[number] = 'Core';
	let fields = [] as any;
	let addField = false;
	let navButton;
	// mode.value = 'create';
	drawerExpanded.value = true;

	collection.subscribe((_) => {
		collectionName = mode.value == 'edit' ? $collection.path : '';
		icon = mode.value == 'edit' ? $collection.icon : '';
		fields = mode.value == 'edit' ? $collection.fields : [];
		permissionsValue = $collection?.permissions || defaultPermissions;
	});
	$: if (mode.value == 'create') {
		collectionName = '';
		icon = '';
		fields = [];
	}
	onDestroy(async () => {
		// await updateCollections();
	});
	function save() {
		for (let role in permissionsValue) {
			for (let permission in permissionsValue[role]) {
				if (permissions.indexOf(permission as any) == -1) {
					delete permissionsValue[role][permission];
				}
			}
		}

		if (!collectionName) return;
		let data =
			mode.value == 'edit'
				? obj2formData({
						originalName: $collection.path,
						collectionName,
						fields: $collection.fields,
						permissions: permissionsValue,
						icon
					})
				: obj2formData({ fields, collectionName, icon, permissions: permissionsValue });
		axios.post(`?/saveCollection`, data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}
</script>

<div class="body">
	<button
		class="text-white fixed top-[13px] left-[10px]"
		on:click={() => (drawerExpanded.value = !drawerExpanded.value)}
		><iconify-icon class="md:hidden h-[17px]" icon="mingcute:menu-fill" width="24" /></button
	>
	<div class="left_panel">
		<Drawer>
			<section>
				<Categories modeSet="edit" />
			</section>

			<div class:max-md:hidden={!drawerExpanded.value && navButton.x == navButton.radius}>
				<FloatingNav bind:buttonInfo={navButton} />
			</div>
			<section class="text-center">
				<button
					on:click={() => axios.get('/api/exportData')}
					class="p-2 bg-[#353b63] text-white w-full"
				>
					Export Data
				</button>
			</section>
		</Drawer>
	</div>
	<div class="right_panel flex-grow">
		<Header saveFunction={save} />
		<div class="flex justify-center gap-1 w-full mb-10">
			{#each tabs as tab}
				<Button
					class="!min-w-[120px]"
					bgColor={tab == currentTab ? '#42c542' : 'gray'}
					on:click={() => (currentTab = tab)}>{tab}</Button
				>
			{/each}
		</div>
		{#if currentTab == 'Core'}
			<div>
				<FloatingInput theme="dark" label="name" name="name" bind:value={collectionName} />
				<FloatingInput theme="dark" label="icon" name="icon" bind:value={icon} />
			</div>
		{:else if currentTab == 'Permissions'}
			<div>
				<PermissionsTable bind:value={permissionsValue} />
			</div>
		{:else if mode.value == 'create'}
			<WidgetBuilder {fields} bind:addField />
		{:else if mode.value == 'edit'}
			<WidgetBuilder bind:fields={$collection.fields} bind:addField />
		{/if}
	</div>
</div>

<style>
	.body {
		display: flex;
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: #242728;
	}

	.right_panel {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
	}
</style>
