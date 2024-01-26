<script lang="ts">
	export let items;
	export let selected = items[0];
	export let label: string = '';
	let expanded = false;
</script>

<div class="container {$$props.class}">
	<p on:click={() => (expanded = !expanded)} class:selected={expanded}>{selected || label}</p>
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
					{item}
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
		background-color: gray;
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
		border-bottom: 1px solid rgb(153, 153, 153);
	}
</style>
