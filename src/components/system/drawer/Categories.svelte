<script lang="ts">
	import { categories, collection } from '@src/stores/load';
	import { page } from '$app/stores';
	import type { User } from '@src/auth/types';
	import { mode, drawerExpanded } from '@src/stores/store.svelte';
	export let data = $categories || {};
	export let modeSet: typeof mode.value = 'view';
	let expanded: { [key: string]: boolean } = {};
	let user: User = $page.data.user;
</script>

{#each Object.keys(data).filter((item) => item != 'is_category') as item, index}
	{#if data[item].is_category}
		<div
			class={'flex items-center  tooltip_right relative mb-1 h-[40px] cursor-pointer overflow-visible rounded-sm bg-surface-600 py-2 text-center text-white'}
			class:arrow={data[item].is_category}
			class:arrow_up={expanded[index]}
			on:click={() => (expanded[index] = !expanded[index])}
		>
			<p class="mx-auto">{item}</p>
		</div>
		<div class:expand={expanded[index]} class=" ml-3 wrapper">
			<div class="{expanded[index] ? 'delayed-overflow' : 'overflow-hidden'} inner">
				<svelte:self data={data[item]} {modeSet} />
			</div>
		</div>
	{:else}
		<div
			class:hidden={data[item]?.permissions?.[user.role]?.read == false ||
				data[item]?.hidden == true}
			class={'relative cursor-pointer border-b border-surface-200 bg-[#777a89] p-0 text-center text-white last:mb-1 last:border-b-0 hover:bg-[#65dfff] hover:text-white dark:bg-surface-400 dark:text-white dark:hover:bg-[#65dfff] dark:hover:text-white flex h-[40px] items-center justify-center'}
			on:click={() => {
				mode.set(modeSet);
				collection.set(data[item]);
			}}
		>
			<div class="flex items-center h-full" class:grow={drawerExpanded.value}>
				<iconify-icon
					icon={data[item].icon}
					class:ml-auto={!drawerExpanded.value}
					class:ml-2={drawerExpanded.value}
				></iconify-icon>
				{#if drawerExpanded.value}
					<p class="mx-auto">{data[item].label || item}</p>
				{/if}
			</div>
		</div>
	{/if}
{/each}

<style>
	.arrow::after {
		content: '';
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
	}

	.arrow_up::after {
		transform: rotate(225deg);
	}
	.wrapper {
		display: grid;
		grid-template-rows: 0fr;
		transition: grid-template-rows 0.2s ease-out;
		max-height: 300px;
	}
	.expand {
		grid-template-rows: 1fr;
	}
	.inner::-webkit-scrollbar-thumb {
		border-radius: 50px;
		background-color: #0eb4c4;
	}
	.inner::-webkit-scrollbar {
		width: 10px;
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
</style>
