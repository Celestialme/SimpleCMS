<script lang="ts">
	import { fade } from 'svelte/transition';
	import { writable } from 'svelte/store';

	export let text = '';
	export let width = 'w-auto';
	export let color = 'text-white';
	export let padding = 'p-4';
	export let spacing = 'space-x-4';
	export let rounded = 'rounded';
	export let shadow = 'shadow-lg';
	export let zIndex = 'z-[888]';
	export let buttonAction = 'btn variant-filled';
	export let buttonDismiss = 'btn-icon btn-icon-sm variant-filled';
	export let buttonDismissLabel = '✕';

	export const toastVisible = writable(false);
</script>

<button on:click={() => toastVisible.set(true)}>Show Toast</button>

{#if $toastVisible}
	<div
		transition:fade={{ duration: 300 }}
		class={`fixed bottom-4 right-4 ${width} ${padding} ${color} ${rounded} ${shadow} ${zIndex} flex items-center ${spacing}`}
	>
		<span>{text}</span>
		<button class={`${buttonDismiss}`} on:click={() => toastVisible.set(false)}>
			{buttonDismissLabel}
		</button>
	</div>
{/if}
