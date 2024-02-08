<script lang="ts">
	import { collection, unAssigned } from '@src/stores/load';
	import { mode, drawerExpanded } from '@src/stores/store';
	import { categories } from '@src/collections';
	import { page } from '$app/stores';

	import type { User } from '@src/auth/types';
	import CheckIcon from '@src/components/system/icons/CheckIcon.svelte';
	import CheckBox from '@src/components/system/buttons/CheckBox.svelte';
	import { asAny } from '@src/utils/utils';

	export let modeSet: typeof $mode = 'view';
	let expanded: any = {};
	let user: User = $page.data.user;
	let checked = {};
	for (let category of $categories) {
		for (let collection of category.collections) {
			checked[collection.name as string] = true;
		}
	}
</script>

{#each $categories as category, index}
	<div
		class=" tooltip_right relative mb-1 h-[40px] cursor-pointer overflow-visible rounded-sm bg-surface-600 py-2 text-center bg-[#363b4e] text-white"
		class:arrow_up={expanded[index]}
		on:click={(e) => {
			expanded[index] = !expanded[index];
		}}
	>
		<div class="flex items-center h-full arrow">
			<iconify-icon icon={category.icon} class:ml-auto={!$drawerExpanded} class:ml-2={$drawerExpanded} />
			{#if $drawerExpanded}
				<p class="ml-auto">{category.name}</p>
			{/if}
		</div>
	</div>
	<div class:expand={expanded[index]} class="wrapper">
		<div class="{expanded[index] ? 'delayed-overflow' : 'overflow-hidden'} inner">
			{#each category.collections.filter((c) => modeSet == 'edit' || c?.permissions?.[user.role]?.read != false) as _collection}
				<div
					class="relative cursor-pointer border-b border-surface-200 bg-[#777a89] p-0 text-center text-white last:mb-1 last:border-b-0 hover:bg-[#65dfff] hover:text-white dark:bg-surface-400 dark:text-white dark:hover:bg-[#65dfff] dark:hover:text-white flex h-[40px] items-center justify-center"
					on:click={(e) => {
						mode.set(modeSet);
						collection.set(_collection);
					}}
				>
					{#if modeSet == 'edit'}
						<CheckBox
							bind:checked={checked[asAny(_collection.name)]}
							callback={() => {
								checked = checked;
								category.collections = category.collections.filter((x) => x.name != _collection.name);
								$unAssigned = [...$unAssigned, _collection];
							}}
							svg={CheckIcon}
						/>
					{/if}
					<div class="flex items-center h-full" class:grow={$drawerExpanded}>
						<iconify-icon icon={_collection.icon} class:ml-auto={!$drawerExpanded} class:ml-2={$drawerExpanded} />
						{#if $drawerExpanded}
							<p class="mx-auto">{_collection.name}</p>
						{/if}
					</div>
				</div>
			{/each}
			{#if modeSet == 'edit' && $unAssigned.length > 0}
				<div class="border-b-2" />
				{#each $unAssigned as _collection}
					<p
						class="relative cursor-pointer border-b border-surface-200 bg-[#777a89] p-0 text-center text-white last:mb-1 last:border-b-0 hover:bg-[#65dfff] hover:text-white dark:bg-surface-400 dark:text-white dark:hover:bg-[#65dfff] dark:hover:text-white flex h-[40px] items-center justify-center"
						on:click={(e) => {
							mode.set(modeSet);
							collection.set(_collection);
						}}
					>
						<CheckBox
							bind:checked={checked[asAny(_collection.name)]}
							callback={() => {
								checked = checked;
								category.collections.push(_collection);
								$unAssigned = $unAssigned.filter((x) => x.name != _collection.name);
							}}
							svg={CheckIcon}
						/>
						<span class="mx-auto">
							{_collection.name}
						</span>
					</p>
				{/each}
			{/if}
		</div>
	</div>
{/each}

<style>
	.wrapper {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.2s ease-out;
		max-height: 100px;
	}
	.inner::-webkit-scrollbar-thumb {
		border-radius: 50px;
		background-color: #0eb4c4;
	}
	.inner::-webkit-scrollbar {
		width: 10px;
	}
	.expand {
		grid-template-rows: 1fr;
	}
	.delayed-overflow {
		overflow: hidden;
		animation: overflow 0s ease-out forwards;
		animation-delay: 0.2s;
	}
	@keyframes overflow {
		0% {
			overflow: hidden;
		}
		100% {
			overflow: auto;
		}
	}
	.arrow::after {
		content: '';
		/* position: absolute; */
		right: 0;
		top: 40%;
		transform: translateY(-50%);
		border: solid white;
		border-width: 0 3px 3px 0;
		display: inline-block;
		padding: 3px;
		transform: rotate(45deg);
		margin-right: 10px;
		transition: transform 0.1s ease-in;
		margin-left: auto;
	}

	.arrow_up::after {
		transform: rotate(225deg);
	}
</style>
