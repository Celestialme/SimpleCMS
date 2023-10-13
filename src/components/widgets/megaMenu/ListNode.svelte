<script lang="ts">
	import { mode } from '@src/stores/store';
	import { currentChild } from '.';
	import { contentLanguage } from '@src/stores/load';
	import DeleteIcon from '@src/components/system/icons/DeleteIcon.svelte';

	export let self: { [key: string]: any; children: any[] };
	export let parrent: { [key: string]: any; children: any[] } | null = null;
	export let level = 0;
	export let depth = 0;
	export let showFields = false;
	export let maxDepth = 0;

	let expanded = false;

	export let refresh = () => {
		self.children.length = self.children?.length;
	};
</script>

<div
	on:click={(e) => {
		expanded = !expanded;
	}}
	class="header"
	style="margin-left:{20 * level}px"
>
	{#if self.children?.length > 0}
		<div class="arrow" class:expanded />
	{/if}
	{self?.Header[$contentLanguage]}
	{#if level < maxDepth - 1}
		<button
			on:click|stopPropagation={() => {
				$currentChild = self;
				depth = level + 1;
				showFields = true;
				mode.set('create');
			}}
			class="btn btn-sm ml-2">+</button
		>
	{/if}
	<button
		on:click|stopPropagation={() => {
			$currentChild = self;
			$mode = 'edit';
			depth = level;
			console.log(self);
			showFields = true;
		}}
		class="btn btn-sm">✎</button
	>
	{#if level > 0}
		<button
			on:click|stopPropagation={() => {
				parrent?.children?.splice(parrent?.children?.indexOf(self), 1);
				refresh();
			}}
			class="btn btn-sm"><DeleteIcon /></button
		>
	{/if}
</div>

{#if self.children?.length > 0 && expanded}
	<ul>
		{#each self.children as child}
			<li class="cursor-pointer">
				<svelte:self {refresh} self={child} level={level + 1} bind:depth bind:showFields parrent={self} {maxDepth} />
			</li>
		{/each}
	</ul>
{/if}

<style>
	.header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: flex-start;
		gap: 2px;
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
