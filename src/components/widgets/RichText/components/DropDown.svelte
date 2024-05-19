<script lang="ts">
	export let icon = '';
	export let label = '';
	export let show = false;
	export let active = '';
	export let key: string;
	export let items: {
		name: string;
		icon?: string;
		onClick: () => void;
		active: () => boolean;
	}[] = [];
	$: key != active && (expanded = false);
	$: selected = items.filter((item) => item.active())[0];
	let expanded = false;
	let header: HTMLDivElement;
	function setPosition(node: HTMLDivElement) {
		let parent = header.parentElement as HTMLElement;
		node.style.minWidth = header.offsetWidth + 'px';
		let left_pos = header.getBoundingClientRect().left - parent.getBoundingClientRect().left;
		if (left_pos + node.offsetWidth > parent.offsetWidth) {
			node.style.right = '0';
		} else {
			node.style.left = left_pos < 0 ? '0' : left_pos + 'px';
		}
	}
</script>

<div
	class="wrapper"
	bind:this={header}
	class:hidden={!show}
	on:click={() => {
		expanded = !expanded;
		active = key;
	}}
>
	<div class="selected arrow" class:arrow_up={expanded}>
		<iconify-icon icon={icon || selected?.icon} width="20"></iconify-icon>

		<p class="whitespace-nowrap max-w-[80px] overflow-hidden">{selected ? selected.name : label}</p>
	</div>
	{#if expanded}
		<div class="items" use:setPosition>
			{#each items as item}
				<button
					class="flex items-center gap-[5px]"
					on:click|stopPropagation={() => {
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
	{/if}
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
		position: fixed;
		/* left: 0; */
		top: 100%;
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
	button {
		width: 100%;
		padding: 2px 10px;
	}
	button:hover {
		background-color: #e7e2e2;
		border-radius: 6px;
	}
</style>
