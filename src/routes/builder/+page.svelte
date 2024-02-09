<script lang="ts">
	import 'iconify-icon';
	import Collections from '@src/components/system/drawer/Collections.svelte';
	import { drawerExpanded, mode } from '@src/stores/store.js';
	import { collection } from '@src/stores/load';
	import axios from 'axios';
	import { categories } from '@src/collections';
	import { obj2formData } from '@src/utils/utils';
	import WidgetBuilder from './WidgetBuilder.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import FloatingNav from '@src/components/system/FloatingNav.svelte';
	import Header from './Header.svelte';
	let name = $mode == 'edit' ? $collection.name : '';
	let icon = $mode == 'edit' ? $collection.icon : '';
	let fields = [];
	let addField = false;
	let navButton;
	$mode = 'create';
	$drawerExpanded = true;

	collection.subscribe((_) => {
		name = $mode == 'edit' ? $collection.name : '';
		icon = $mode == 'edit' ? $collection.icon : '';
	});
	$: if ($mode == 'create') {
		name = '';
		icon = '';
	}

	function save() {
		let _categories: { name: string; icon: string; collections: string[] }[] = [];
		for (let category of $categories) {
			_categories.push({
				name: category.name,
				icon: category.icon,
				collections: category.collections.map((x) => `🗑️collections.${x.name}🗑️` as string)
			});
		}

		axios.post(`?/saveConfig`, obj2formData({ categories: _categories }), {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
		let data =
			$mode == 'edit'
				? obj2formData({ originalName: $collection.name, collectionName: name, fields: $collection.fields, icon })
				: obj2formData({ fields, collectionName: name, icon });
		axios.post(`?/saveCollection`, data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}
</script>

<div class="body">
	<button class="text-white fixed top-[13px] left-[10px]" on:click={() => ($drawerExpanded = !$drawerExpanded)}
		><iconify-icon class="md:hidden h-[17px]" icon="mingcute:menu-fill" width="24" /></button
	>
	<div class="left_panel">
		<Drawer>
			<section>
				<Collections modeSet="edit" />
			</section>

			<div class:max-md:hidden={!$drawerExpanded && navButton.x == navButton.radius}>
				<FloatingNav bind:buttonInfo={navButton} />
			</div>
		</Drawer>
	</div>
	<div class="right_panel flex-grow">
		<Header saveFunction={save} />

		<div>
			<FloatingInput theme="dark" label="name" name="name" bind:value={name} />
			<FloatingInput theme="dark" label="icon" name="icon" bind:value={icon} />
		</div>
		{#if $mode == 'create'}
			<div>
				<WidgetBuilder {fields} bind:addField />
			</div>
		{:else if $mode == 'edit'}
			<div>
				<WidgetBuilder fields={$collection.fields} bind:addField />
			</div>
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
