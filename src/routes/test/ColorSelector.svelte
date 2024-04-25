<script lang="ts">
	import { createEventDispatcher } from 'svelte';
	import ColorPicker, { ChromeVariant } from 'svelte-awesome-color-picker';
	let expanded = false;
	export let color = '';
	let dispatch = createEventDispatcher();
	$: dispatch('change', color);
	$: console.log(color);
</script>

<div class="wrapper">
	<div class="selected arrow" class:arrow_up={expanded} on:click={() => (expanded = !expanded)}>
		<iconify-icon icon="fluent-mdl2:color-solid" width="20"></iconify-icon>
	</div>

	<div class="pallette" class:!hidden={!expanded}>
		<ColorPicker bind:hex={color} components={ChromeVariant} sliderDirection="horizontal" isDialog={false} />>
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
		width: 80px;
		box-shadow: 0px 0px 3px 0px #bfbfbf;
		padding: 10px;
		cursor: pointer;
		border-radius: 4px;
	}
	.pallette {
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
