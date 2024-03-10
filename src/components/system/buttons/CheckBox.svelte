<script>
	export let checked = false;
	export let svg;
	export let callback = () => {};
</script>

<div
	class="flex h-[28px] w-[28px] items-center justify-center rounded-md border-2 border-gray-600 dark:border-surface-500 {$$props.class}"
	on:click|stopPropagation={() => {
		checked = !checked;
		callback();
	}}
>
	{#if checked}
		<svelte:component this={svg} />
	{/if}
</div>
