<script lang="ts">
	import { mode } from '@src/stores/store';
	import { currentChild } from '.';
	import { contentLanguage } from '@src/stores/load';

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
	class:!cursor-pointer={self.children?.length > 0}
	style="margin-left:{20 * level}px;
	max-width:{window.screen.width <= 700 ? `calc(100% + ${20 * (maxDepth - level)}px)` : `calc(100% - ${20 * level}px)`}"
>
	<div class="ladder" style="width:{20 * level}px" />
	{#if self.children?.length > 0}
		<div class="arrow" class:expanded />
	{/if}
	{self?.Header[$contentLanguage]}
	<div class="flex items-center ml-auto gap-1">
		{#if level < maxDepth - 1}
			<button
				on:click|stopPropagation={() => {
					$currentChild = self;
					depth = level + 1;
					showFields = true;
					mode.set('create');
				}}><iconify-icon icon="uil:focus-add" width="24" height="24" /></button
			>
		{/if}
		<button
			on:click|stopPropagation={() => {
				$currentChild = self;
				$mode = 'edit';
				depth = level;
				console.log(self);
				showFields = true;
			}}><iconify-icon icon="raphael:edit" width="24" height="24" /></button
		>
		{#if level > 0}
			<button
				on:click|stopPropagation={() => {
					parrent?.children?.splice(parrent?.children?.indexOf(self), 1);
					refresh();
				}}><iconify-icon icon="tdesign:delete-1" width="24" height="24" /></button
			>
		{/if}
	</div>
</div>

{#if self.children?.length > 0 && expanded}
	<ul class="children" style="margin-left:{20 * level + 15}px;">
		{#each self.children as child}
			<li>
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
		border: 1px solid #80808045;
		border-radius: 5px;
		padding: 10px 0px;
		padding-left: 50px;
		padding-right: 10px;
		margin-bottom: 5px;
		width: 100vw;
		min-width: 200px;
		cursor: default;
	}
	.ladder {
		position: absolute;
		height: 0;
		right: 100%;
		border-top: 1px dashed;
	}
	.arrow {
		position: absolute;
		left: 10px;
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
	button:active {
		transform: scale(0.9);
	}
	.children {
		border-left: 1px dashed;
	}
</style>
