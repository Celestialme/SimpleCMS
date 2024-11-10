<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	interface Props {
		items: any;
		selected?: any;
		label?: string;
		modifier?: any;
		icon?: String | undefined;
		class?: string;
	}

	let {
		items,
		selected = $bindable(),
		label = '',
		modifier = (input) => input,
		icon = undefined,
		class: _class
	}: Props = $props();
	let expanded = $state(false);
	selected = selected || items[0];
</script>

<div class="container {twMerge('bg-gray-500', _class)} ">
	<div
		onclick={() => (expanded = !expanded)}
		class="flex cursor-pointer items-center justify-evenly"
		class:selected={expanded}
	>
		{#if icon}
			<iconify-icon {icon} width="24"></iconify-icon>
		{/if}
		<p>{modifier(selected || label)}</p>
	</div>
	{#if expanded}
		<div class="items">
			{#each items.filter((item) => item !== selected) as item}
				<p
					class="item"
					onclick={() => {
						selected = item;
						expanded = false;
					}}
				>
					{modifier(item)}
				</p>
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		border-radius: 5px;
		overflow: hidden;
	}
	.selected {
		border-bottom: 1px solid white;
	}
	p {
		position: relative;

		padding: 5px 10px;
		color: white;
		text-align: center;
		user-select: none;
		cursor: pointer;
	}
	.item:hover {
		background-color: aqua;
	}
	.item {
		width: 100%;
		border-bottom: 1px solid rgb(153, 153, 153);
	}
</style>
