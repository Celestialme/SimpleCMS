<script lang="ts">
	import { collection } from '@src/stores/load';
	import MultiButton from './system/buttons/MultiButton.svelte';
</script>

<div class="wrapper">
	<div class="collection">
		{$collection.name}
	</div>

	<MultiButton />
</div>

<style>
	.collection {
		width: 200px;
		font-size: 22px;
	}

	.wrapper {
		position: relative;
		height: 50px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		overflow: visible;
		z-index: 1;
	}
</style>
