<script lang="ts">
	import Content from './Content.svelte';

	import { mode } from '@src/stores/store';
	import { currentChild } from '.';
	import { contentLanguage } from '@src/stores/store';

	export let self: { [key: string]: any; children: any[] };
	export let level = 0;
	export let depth = 0;
	export let showFields = false;
	export let maxDepth = 0;

	let expanded = false;

	// let nodes = {
	// 	node1: {
	// 		name: 'Menu Name 1',
	// 		items: [{ id: 'node2' }, { id: 'node3' }, { id: 'node4' }],
	// 		id: 'node1'
	// 	},
	// 	node2: {
	// 		name: 'Categories 1',
	// 		items: [{ id: 'node5' }, { id: 'node6' }, { id: 'node7' }, { id: 'node8' }],
	// 		id: 'node2'
	// 	},
	// 	node3: {
	// 		name: 'Categories 2',
	// 		items: [{ id: 'node9' }, { id: 'node10' }, { id: 'node11' }, { id: 'node12' }],
	// 		id: 'node3'
	// 	}
	// };

	// for (let i = 4; i < 17; i++) {
	// 	nodes[`node${i}`] = { id: `node${i}`, name: `item ${i}` };
	// }

	// nodes['node10'].color = 'steelblue';
	// nodes['node11'].color = 'steelblue';
	// nodes['node14'].color = 'orange';
	// nodes['node15'].color = 'orange';
	// nodes['node6'].color = 'forestgreen';
</script>

<!-- <div class="bg-error-600 mb-4">
	<h3 class="text-center mb-2">Try dragging your Menu Categories</h3>
	<Content node={nodes.node1} bind:nodes />
</div> -->

{#if level == 0 && $mode != 'edit'}
	<div class="text-center border border-x-0 py-2 font-bold mb-2">Menu Name</div>

	<button
		on:keydown
		on:click={() => (expanded = !expanded)}
		class="relative mb-2"
		style="margin-left:{20 * level}px"
	>
		{#if self.children?.length > 0}
			<div class="arrow" class:expanded />
		{/if}
		<!-- {console.log('self', self)}
	    {console.log('$contentLanguage', $contentLanguage)} -->

		<div class="flex items-center gap-2">
			<!-- Mene Name -->
			<button
				on:click={() => {
					$currentChild = self;
					$mode = 'edit';
					depth = level;
					//console.log(self);
					showFields = true;
				}}
				class="input p-2"
			>
				{self?.Header[$contentLanguage]}
			</button>

			<!-- Edit Button -->
			<button
				type="button"
				on:click={() => {
					$currentChild = self;
					$mode = 'edit';
					depth = level;
					//console.log(self);
					showFields = true;
				}}
				class="btn-icon variant-soft-tertiary{level == 0 ? 'ml-auto' : ''}"
			>
				<iconify-icon icon="mdi:pen" width="28" />
			</button>
		</div>
	</button>

	<div class="text-center border border-x-0 py-2 font-bold mb-2">Enter your Menu Categories</div>

	<!-- Categories Parent-->
	{#if level < maxDepth - 1}
		<button
			type="button"
			on:click={() => {
				$currentChild = self;
				depth = level + 1;
				showFields = true;
				mode.set('create');
			}}
			class="btn-icon variant-soft-secondary"
		>
			<iconify-icon icon="icons8:plus" width="28" />
		</button>
	{/if}

	<!-- Categories Children-->
	{#if self.children?.length > 0 && expanded}
		<ul>
			{#each self.children as child}
				<li class="cursor-pointer">
					<svelte:self
						self={child}
						level={level + 1}
						bind:depth
						bind:showFields
						{maxDepth}
						on:keydown
						on:click={() => {
							depth = level;
							showFields = true;
						}}
					/>
				</li>
			{/each}
		</ul>
	{/if}
{/if}

<style lang="postcss">
	.arrow {
		position: absolute;
		left: -20px;
		top: 40%;
		transform: translateY(-50%);
		border: solid black;
		border-width: 0 3px 3px 0;
		display: inline-block;
		padding: 3px;
		transform: rotate(-45deg);
		margin-right: 10px;
		transition: transform 0.1s ease-in;
	}
	.expanded {
		transform: rotate(45deg);
	}
</style>
