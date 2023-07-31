<script lang="ts">
	import '@src/collections';
	import Collections from '@src/components/Collections.svelte';
	import { user } from '@src/stores/store';
	import { mode } from '@src/stores/store.js';
	import { collection } from '@src/collections/index';
	import { obj2formData } from '@src/utils/utils';
	import WidgetBuilder from './WidgetBuilder.svelte';

	export let data;

	user.set(data.user);

	let name = 'Gen';
	let fields = [];
	let addField = false;

	$: console.log($collection);

	// Function to save data by sending a POST request to the /api/builder endpoint
	async function save() {
		//console.log({ ...$collection.fields });
		let data =
			$mode == 'edit' ? obj2formData({ fields: $collection.fields }) : obj2formData({ fields });
		fetch(`/api/builder`, {
			method: 'POST',
			body: data,
			headers: {
				'Content-Type': 'multipart/form-data'
			}
		});
	}

	//export let hasCollections: any;
</script>

<!-- {#if hasCollections}
	<p>Please use the /builder first.</p>
{:else} -->
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
			<WidgetBuilder {fields} bind:addField />
		{:else if $mode == 'edit'}
			<WidgetBuilder fields={$collection.fields} bind:addField />
		{/if}
	</div>
	<button on:click={save} class="btn variant-filled-primary text-white"> Save </button>
</div>

<!-- {/if} -->

<style>
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
