<script lang="ts">
	import 'iconify-icon';
	import Collections from '@src/components/system/drawer/Collections.svelte';
	import { drawerExpanded, mode } from '@src/stores/store.js';
	import { collection, unAssigned } from '@src/stores/load';
	import axios from 'axios';
	import { categories } from '@src/collections';
	import { obj2formData } from '@src/utils/utils';
	import WidgetBuilder from './WidgetBuilder.svelte';
	import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
	import Drawer from '@src/components/system/drawer/Drawer.svelte';
	import FloatingNav from '@src/components/system/FloatingNav.svelte';
	import Button from '@src/components/system/buttons/Button.svelte';
	let name = $mode == 'edit' ? $collection.name : '';
	let icon = $mode == 'edit' ? $collection.icon : '';
	let fields = [];
	let addField = false;
	let navButton;
	$drawerExpanded = true;
	function save() {
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
	collection.subscribe((_) => {
		name = $mode == 'edit' ? $collection.name : '';
		icon = $mode == 'edit' ? $collection.icon : '';
	});
	function saveConfig() {
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
	}
	$: console.log(navButton);
</script>

<div class="body">
	<button class="fixed left-[10px] top-[13px] text-white" on:click={() => ($drawerExpanded = !$drawerExpanded)}
		><iconify-icon class="h-[17px] md:hidden" icon="mingcute:menu-fill" width="24" /></button
	>
	<div class="left_panel">
		<Drawer>
			<section>
				<Collections modeSet="edit" />
			</section>
			<Button class="mt-auto  flex w-full items-center justify-center" on:click={saveConfig}>
				{#if $drawerExpanded}
					Save Collections
				{:else}
					<iconify-icon width="30" icon="material-symbols:sync-saved-locally-outline-rounded"></iconify-icon>
				{/if}
			</Button>

			<div class:max-md:hidden={!$drawerExpanded && navButton.x == navButton.radius}>
				<FloatingNav bind:buttonInfo={navButton} />
			</div>
		</Drawer>
	</div>
	<div class="right_panel">
		<p class="text-white">unAssigned Collections</p>
		<p class="text-white">{$unAssigned.map((x) => x.name)}</p>
		<div
			class="add_new"
			on:click={() => {
				mode.set('create');
			}}
		>
			<iconify-icon icon="typcn:plus" class="text-white" width="50" />
		</div>
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
	<button on:click={save} class="text-white"> save </button>
</div>

<style>
	.body {
		display: flex;
		position: fixed;
		width: 100vw;
		height: 100vh;
		background: #242728;
	}
	.add_new {
		display: flex;
		justify-content: center;
		align-items: center;
		background-color: #2fdd00;
		width: 150px;
		height: 80px;
		border-radius: 20px;
		cursor: pointer;
	}
	.add_new:active {
		transform: scale(0.9);
	}
	.right_panel {
		display: flex;
		flex-direction: column;
		width: 100%;
		align-items: center;
	}
</style>
