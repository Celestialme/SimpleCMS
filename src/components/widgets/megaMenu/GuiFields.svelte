<script lang="ts">
	import Button from '@src/components/system/buttons/Button.svelte';
	import WidgetBuilder from '@src/routes/builder/WidgetBuilder.svelte';
	export let value: Array<Array<any>> = [];
	console.log(value);
</script>

<div class="container border p-2">
	<p>Menu Fields</p>
	<Button on:click={() => (value = [...value, []])}>Add Level</Button>
	{#each value as level, index}
		<div class="level">
			<p>level {index + 1}</p>
			<WidgetBuilder fields={level} />
		</div>
	{/each}
</div>

<style>
	.container {
		color: white;
		width: 99%;
		display: flex;
		flex-direction: column;
		align-items: center;
		box-sizing: border-box;
		overflow: auto;
	}
	.level {
		text-align: center;
		border: 1px dashed white;
		padding: 15px;
		margin: 10px;
	}
</style>
