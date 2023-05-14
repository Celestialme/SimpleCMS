<script lang="ts">
	export let initials = '';
	export let fill = '';
	export let src = '';
	export let action: (params: string) => void = () => {};
	export let actionParams: string = '';
	export let background = 'bg-gray-400';
	export let width = 'w-12';
	export let border = '';
	export let rounded = 'rounded-full';
	export let shadow = '';
	export let cursor = '';

	function handleClick() {
		action(actionParams);
	}
</script>

<div class={`${background} ${width} ${border} ${rounded} ${shadow} ${cursor} flex items-center justify-center`} on:click={handleClick}>
	{#if src}
		<img class={`${width} ${rounded}`} {src} alt="Avatar" />
	{:else if initials}
		<svg class={`${width}`} viewBox="0 0 100 100">
			<text class={`${fill}`} x="50" y="50" text-anchor="middle" dominant-baseline="central" font-size="50">
				{initials}
			</text>
		</svg>
	{/if}
</div>
