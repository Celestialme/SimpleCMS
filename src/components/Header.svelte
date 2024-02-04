<script lang="ts">
	import { collection, contentLanguage } from '@src/stores/load';
	import MultiButton from './system/buttons/MultiButton.svelte';
	import { drawerExpanded, mode } from '@src/stores/store';
	import DeleteIcon from './system/icons/DeleteIcon.svelte';
	import DropDown from './system/dropDown/DropDown.svelte';
</script>

<div class="h-[60px]">
	<div class="wrapper max-md:!fixed">
		<button class="text-white" on:click={() => ($drawerExpanded = !$drawerExpanded)}
			><iconify-icon class="md:hidden h-[17px]" icon="mingcute:menu-fill" width="24" /></button
		>
		<div class="collection mr-auto">
			{$collection.name}
		</div>
		<div class="w-[50px] h-full relative">
			<DropDown class="absolute" items={['en', 'de']} bind:selected={$contentLanguage} />
		</div>
		{#if !['edit', 'create'].includes($mode)}
			<MultiButton />
		{:else}
			<button on:click={() => mode.set('view')}>
				<DeleteIcon />
			</button>
		{/if}
	</div>
</div>

<style>
	.collection {
		font-size: 22px;
	}

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
