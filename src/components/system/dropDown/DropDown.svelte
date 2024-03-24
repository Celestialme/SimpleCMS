<script lang="ts">
	import { twMerge } from 'tailwind-merge';

	export let items;
	export let selected = items[0];
	export let label: string = '';
	export let modifier = (input) => input;
	export let icon: String | undefined = undefined;
	let expanded = false;
</script>

<div class="container {twMerge('bg-gray-500', $$props.class)} ">
	<div on:click={() => (expanded = !expanded)} class="flex cursor-pointer items-center justify-evenly" class:selected={expanded}>
		{#if icon}
			<iconify-icon {icon} width="24" />
		{/if}
		<p>{modifier(selected || label)}</p>
	</div>
	{#if expanded}
		<div class="items">
			{#each items.filter((item) => item !== selected) as item}
				<p
					class="item"
					on:click={() => {
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
