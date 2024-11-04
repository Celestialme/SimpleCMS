<script>
	export let checked = false;
	export let icon;
	export let onchange = () => {};
</script>

<div
	class="flex min-h-[28px] h-[28px] w-[28px] min-w-[28px] items-center justify-center rounded-md border-2 border-gray-600 dark:border-surface-500 {$$props.class}"
	on:click|stopPropagation={() => {
		checked = !checked;

		onchange();
	}}
>
	{#if checked}
		<svelte:component this={icon} />
	{/if}
</div>
