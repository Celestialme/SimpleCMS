<script lang="ts">
	import { drawerExpanded } from '@src/stores/store.svelte';
	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
</script>

<div
	class="wrapper max-md:fixed max-md:w-0"
	class:max-md:!min-w-0={drawerExpanded() == false}
	class:drawerExpanded={drawerExpanded()}
>
	<section class="h-[50px] mb-[10px] !p-[10px]">
		<button class="text-white" onclick={() => drawerExpanded.set(!drawerExpanded())}
			><iconify-icon class="h-[14px]" icon="mingcute:menu-fill" width="24"></iconify-icon></button
		>
	</section>

	{@render children?.()}
</div>

<style>
	.wrapper {
		display: flex;
		flex-direction: column;
		height: 100vh;
		background-color: #242734;
		min-width: 60px;
		overflow-x: hidden;
		transition: min-width 0.2s ease-out;
		z-index: 100;
	}
	.drawerExpanded {
		display: flex !important;
		min-width: 240px;
	}
	section {
		width: 100%;
		padding: 0 4px;
	}
</style>
