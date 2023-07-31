<script lang="ts">
	import WidgetBuilder from '@src/routes/builder/WidgetBuilder.svelte';
	export let value: Array<{ fields: Array<any> }> = [];
	console.log(value);
</script>

<div class="container border p-2">
	<p>Menu Fields</p>
	{#each value as level, index}
		<div>
			<p>level {index + 1}</p>
			<WidgetBuilder fields={level.fields} />
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
</style>
