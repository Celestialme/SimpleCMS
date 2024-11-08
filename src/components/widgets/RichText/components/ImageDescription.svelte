<script lang="ts">
	import { track } from '@src/utils/reactivity.svelte';

	interface Props {
		show?: boolean;
		value?: string;
		key?: string;
		active?: string;
		onsubmit?: (value: string) => void;
	}

	let { show = false, value = '', key = '', active = $bindable(''), onsubmit }: Props = $props();
	let _value = $state('');
	$effect(() => {
		_value = value;
	});

	track(
		() => key != active && (show_input = false),
		() => active
	);
	let show_input = $state(false);

	track(
		() => (show_input = false),
		() => show
	);
</script>

<div class:hidden={!show}>
	<button
		onclick={() => {
			show_input = !show_input;
			active = key;
		}}
		class="flex items-center"
	>
		<iconify-icon icon="material-symbols:description" width="20"></iconify-icon>
		description
	</button>
	{#if show_input}
		<div class="description">
			<input
				type="text"
				bind:value={_value}
				onkeydown={(e) => {
					if (e.key == 'Enter') {
						show_input = false;
						onsubmit?.(_value);
					}
				}}
			/>
		</div>
	{/if}
</div>

<style>
	.description {
		position: fixed;
		top: 100%;
		margin-top: 20px;
		left: 50%;
		transform: translate(-50%);
	}
	input {
		border: 1px solid;
		width: 200%;
		padding: 5px;
		border-radius: 5px;
	}
</style>
