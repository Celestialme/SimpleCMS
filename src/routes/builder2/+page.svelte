<script lang="ts">
	import widgets from '@src/components/widgets';
	import FloatingInput from '@src/components/system/inputs/floatingInput.svelte';
	import Collections from '@src/components/Collections.svelte';
	import { user } from '@src/stores/store';
	import { mode } from '@src/stores/store.js';
	import BuilderFields from './BuilderFields.svelte';
	import { collection } from '@src/collections/index';

	export let data;

	user.set(data.user);

	let widget_keys = Object.keys(widgets);
	console.log(widgets);

	let name = 'Gen';
	let fields = [];

	$: console.log($collection);

	export let hasCollections: any;
</script>

<!-- {#if hasCollections}
	<p>Please use the /builder first.</p>
{:else} -->
	<div class="body">
		<section class="left_panel">
			<Collections modeSet={'edit'} />
		</section>
		<div class="right_panel">
			<div
				class="add_new"
				on:click={() => {
					mode.set('create');
				}}
			>
				<iconify-icon icon="typcn:plus" class="text-white" width="50" />
			</div>
			{#if $mode == 'create'}
				<div>
					<FloatingInput label="name" name="name" />
				</div>
			{:else if $mode == 'edit'}
				<div>
					<FloatingInput label="name" name="name" />
					<BuilderFields fields={$collection.fields} />
				</div>
			{/if}
		</div>
	</div>
<!-- {/if} -->

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
	section {
		width: 240px;
		padding: 0 4px;
	}
</style>
