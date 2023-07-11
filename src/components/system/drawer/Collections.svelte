<script lang="ts">
	import { collection } from '@src/collections';
	import { mode } from '@src/stores/store';
	import { categories } from '@src/collections';
	import { user } from '@src/stores/load';
	export let modeSet: typeof $mode = 'view';
	let expanded: any = {};
</script>

{#each categories as category, index}
	<div
		class="arrow tooltip_right relative mb-1 h-[40px] cursor-pointer overflow-visible rounded-sm bg-surface-600 py-2 text-center bg-[#363b4e] text-white"
		class:arrow_up={expanded[index]}
		on:click={(e) => {
			expanded[index] = !expanded[index];
		}}
	>
		<p>{category.name}</p>
	</div>
	<div class:expand={expanded[index]} class="wrapper">
		<div class={expanded[index] ? 'delayed-overflow' : 'overflow-hidden'}>
			{#each category.collections.filter((c) => c?.permissions?.[$user.role]?.read != false) as _collection}
				<p
					class="relative cursor-pointer border-b border-surface-200 bg-[#777a89] p-0 text-center text-white last:mb-1 last:border-b-0 hover:bg-[#65dfff] hover:text-white dark:bg-surface-400 dark:text-white dark:hover:bg-[#65dfff] dark:hover:text-white flex h-[40px] items-center justify-center"
					on:click={(e) => {
						mode.set(modeSet);
						$collection = _collection;
					}}
				>
					{_collection.name}
				</p>
			{/each}
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
		position: absolute;
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
</style>
