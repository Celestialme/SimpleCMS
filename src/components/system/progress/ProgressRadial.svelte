<script lang="ts">
	export let value: number | undefined = undefined;
	export let stroke = 40;
	export let font = 56;
	export let width = 'w-36';
	export let meter = 'stroke-current text-surface-900 dark:text-surface-50';
	export let track = 'stroke-current text-surface-500/30';
	export let fill = 'fill-current text-surface-900 dark:text-surface-50';
	export let labelledby: string | undefined = undefined;
</script>

<div class={`relative ${width}`}>
	<svg viewBox="0 0 100 100" class="block h-auto w-full">
		<circle cx="50" cy="50" r="45" class={`block ${track}`} stroke-width={`${(stroke / 100) * 10}`} />
		{#if value !== undefined}
			<circle
				cx="50"
				cy="50"
				r="45"
				class={`block ${meter}`}
				stroke-width={`${(stroke / 100) * 10}`}
				stroke-dasharray={`${(value / 100) * (Math.PI * (45 * 2))} ${Math.PI * (45 * 2)}`}
				transform="rotate(-90) translate(-100)"
			/>
		{/if}
		<text x="50" y="50" class={`block ${fill}`} font-size={`${(font / 100) * 10}`} dominant-baseline="central" text-anchor="middle">
			{value !== undefined ? `${value}%` : '-'}
		</text>
	</svg>
</div>
