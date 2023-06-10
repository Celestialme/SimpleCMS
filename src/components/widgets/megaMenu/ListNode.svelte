<script lang="ts">
	import { mode } from '@src/stores/store';
	import { currentChild } from '.';
	import { contentLanguage } from '@src/stores/load';

	export let self: { [key: string]: any; children: any[] };
	export let level = 0;
	export let depth = 0;
	export let showFields = false;
	export let maxDepth = 0;
	let expanded = false;
</script>

<div on:click={() => (expanded = !expanded)} class="header" style="margin-left:{20 * level}px">
	{#if self.children?.length > 0}
		<div class="arrow" class:expanded />
	{/if}
	{self?.Header[$contentLanguage]}
	{#if level < maxDepth}
		<button
			type="button"
			on:click={() => {
				depth = level + 1;
				showFields = true;
				mode.set('create');
			}}
			class="btn btn-sm">+</button
		>
	{/if}
	<button
		type="button"
		on:click={() => {
			$currentChild = self;
			$mode = 'edit';
			depth = level;
			console.log(self);
			showFields = true;
		}}
		class="btn btn-sm {level == 0 ? 'ml-auto' : ''}">✎</button
	>
</div>
{#if self.children?.length > 0 && expanded}
	<ul>
		{#each self.children as child}
			<li class="cursor-pointer">
				<svelte:self
					self={child}
					level={level + 1}
					bind:depth
					bind:showFields
					on:click={() => {
						depth = level;
						showFields = true;
					}}
				/>
			</li>
		{/each}
	</ul>
{/if}

<style lang="postcss">
	.header {
		position: relative;
	}
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
