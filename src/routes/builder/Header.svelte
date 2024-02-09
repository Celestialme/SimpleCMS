<script lang="ts">
	import { drawerExpanded, mode } from '@src/stores/store';
	export let saveFunction = () => {};
</script>

<div class="h-[60px] w-full">
	<div class="wrapper max-md:!fixed max-md:top-0 max-md:left-0">
		<button class="text-white" on:click={() => ($drawerExpanded = !$drawerExpanded)}
			><iconify-icon class="md:hidden h-[17px]" icon="mingcute:menu-fill" width="24" /></button
		>
		<button on:click={() => mode.set('create')} class="flex items-center justify-center bg-green-500 rounded-[50%] w-[35px] h-[35px]"
			><iconify-icon icon="gravity-ui:plus"></iconify-icon></button
		>
		<button on:click={() => saveFunction()} class="flex items-center justify-center bg-green-500 rounded-[50%] w-[35px] h-[35px]"
			><iconify-icon width="25" icon="material-symbols:sync-saved-locally-outline-rounded"></iconify-icon>
		</button>
	</div>
</div>

<style>
	.wrapper {
		position: relative;
		height: 50px;
		width: 100%;
		display: flex;
		justify-content: space-between;
		align-items: center;
		z-index: 1;
		background-color: #242734;
		color: white;
		margin-bottom: 10px;
		padding: 10px;
	}
</style>
