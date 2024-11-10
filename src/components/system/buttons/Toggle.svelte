<script lang="ts">
	import { twMerge } from 'tailwind-merge';
	interface Props {
		trackClass?: string;
		thumbClass?: string;
		value?: boolean;
		width?: number;
		height?: number;
		label?: string;
		labelClass?: string;
	}

	let {
		trackClass = '',
		thumbClass = '',
		value = $bindable(false),
		width = 80,
		height = 40,
		label = '',
		labelClass = ''
	}: Props = $props();
</script>

<div class="container">
	<p class={twMerge('text-white ', labelClass)}>{label}</p>
	<div
		onclick={() => (value = !value)}
		class={twMerge('track bg-white ', trackClass)}
		style="width: {width}px; height: {height}px"
	>
		<div
			class:checked={value}
			class={twMerge('thumb bg-gray-400', thumbClass)}
			style="width: {width / 2}px; height: {height}px"
		></div>
	</div>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: space-between;
		width: 100%;
	}
	.track {
		position: relative;
		cursor: pointer;
		border-radius: 15px;
	}
	.thumb {
		transition: 0.2s;
		position: absolute;

		border-radius: 15px;
		right: 50%;
	}
	.checked {
		right: 0;
		background-color: rgb(4, 203, 4);
	}
</style>
