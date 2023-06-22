<script lang="ts">
	export let items;
	export let selected = items[0];
	let expanded = false;
</script>

<div class="container">
	<p on:click={() => (expanded = !expanded)} class:selected={expanded}>{selected}</p>
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
		padding: 5px 40px;
		color: white;

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
