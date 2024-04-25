<script lang="ts">
	export let icon = '';
	export let items: {
		name: string;
		icon?: string;
		onClick: () => void;
		active: () => boolean;
	}[] = [];

	$: selected = items.filter((item) => item.active())[0];
	let expanded = false;
</script>

<div class="wrapper">
	<div class="selected arrow" class:arrow_up={expanded} on:click={() => (expanded = !expanded)}>
		<iconify-icon icon={icon || selected.icon} width="20"></iconify-icon>

		<p class="whitespace-nowrap max-w-[80px] overflow-hidden">{selected ? selected.name : 'Font'}</p>
	</div>

	<div class="items" class:!hidden={!expanded}>
		{#each items.filter((item) => item != selected) as item}
			<button
				class="flex items-center gap-[5px]"
				on:click={() => {
					item.onClick();
					expanded = false;
				}}
				class:active={item.active}
			>
				<iconify-icon icon={item.icon} width="20"></iconify-icon>
				{item.name}
			</button>
		{/each}
	</div>
</div>

<style>
	.selected {
		display: flex;
		justify-content: center;
		align-items: center;
		gap: 5px;
		text-wrap: nowrap;
		text-overflow: ellipsis ' [..]';
	}
	.wrapper {
		z-index: 10;
		position: relative;
		width: 150px;
		box-shadow: 0px 0px 3px 0px #bfbfbf;
		padding: 10px;
		cursor: pointer;
		border-radius: 4px;
	}
	.items {
		position: absolute;
		left: 0;
		top: 100%;
		min-width: 100%;
		padding: 10px;
		border: 1px solid #d6d6d6;
		cursor: pointer;
		background-color: white;
		display: flex;
		flex-direction: column;
		align-items: start;
		gap: 5px;
		text-wrap: nowrap;
	}
	.arrow::after {
		content: '';
		transform: translateY(-50%);
		border: solid #6b6b6b;
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
