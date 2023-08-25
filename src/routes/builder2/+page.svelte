<script lang="ts">
	import '@src/collections';
	import Collections from '@src/components/Collections.svelte';
	import { user } from '@src/stores/store';
	import { mode } from '@src/stores/store.js';
	import { collection } from '@src/collections/index';
	import axios from 'axios';
	import { obj2formData } from '@src/utils/utils';
	import WidgetBuilder from './WidgetBuilder.svelte';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';

	export let data;

	user.set(data.user);

	let name = $mode == 'edit' ? $collection.name : '';
	let fields = [];
	let addField = false;

	// Function to save data by sending a POST request to the /api/builder endpoint
	function save() {
		let data =
			$mode == 'edit'
				? obj2formData({
						originalName: $collection.name,
						collectionName: name,
						fields: $collection.fields
				  })
				: obj2formData({ fields, collectionName: name });
		axios.post(``, data, {
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}
	collection.subscribe((_) => {
		name = $mode == 'edit' ? $collection.name : '';
	});
</script>

<div class="body">
	<section class="left_panel">
		<Collections modeSet={'edit'} />
	</section>
	<div class="right_panel">
		<button
			class="add_new"
			on:click={() => {
				mode.set('create');
			}}
		>
			<iconify-icon icon="typcn:plus" class="text-white" width="50" />
		</button>
		{#if $mode == 'create'}
			<div>
				<FloatingInput label="name" name="name" bind:value={name} />
				<WidgetBuilder {fields} bind:addField />
			</div>
		{:else if $mode == 'edit'}
			<div>
				<FloatingInput label="name" name="name" bind:value={name} />
				<WidgetBuilder fields={$collection.fields} bind:addField />
			</div>
		{/if}
	</div>
	<button on:click={save} class="text-white"> save </button>
</div>

<style lang="postcss">
	.body {
		display: flex;
		position: fixed;
		width: 100vw;
		height: 100vh;
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
	section {
		width: 240px;
		padding: 0 4px;
	}
</style>
