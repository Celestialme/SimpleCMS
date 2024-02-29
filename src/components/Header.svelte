<script lang="ts">
	import { collection, contentLanguage, headerActionButton } from '@src/stores/load';
	import MultiButton from './system/buttons/MultiButton.svelte';
	import { drawerExpanded, mode } from '@src/stores/store';
	import XIcon from './system/icons/XIcon.svelte';
	import DropDown from './system/dropDown/DropDown.svelte';
	import { publicConfig } from '@root/config/public';
	$: {
		$headerActionButton = XIcon;
		$collection;
	}
</script>

<div class="h-[60px]">
	<div class="wrapper max-md:!fixed max-md:top-0 max-md:left-0">
		<button class="text-white" on:click={() => ($drawerExpanded = !$drawerExpanded)}
			><iconify-icon class="md:hidden h-[17px]" icon="mingcute:menu-fill" width="24" /></button
		>
		<div class="collection mr-auto">
			{$collection?.name}
		</div>
		<div class="w-[50px] h-full relative">
			<DropDown class="absolute" items={publicConfig.AVAILABLE_CONTENT_LANGUAGES} bind:selected={$contentLanguage} />
		</div>
		{#if !['edit', 'create'].includes($mode)}
			<MultiButton />
		{:else}
			<button class="flex item-center justify-center" on:click={() => mode.set('view')}>
				{#if typeof $headerActionButton != 'string'}
					<svelte:component this={$headerActionButton} />
				{:else}
					<iconify-icon width="22" class="p-[10px]" icon={$headerActionButton} />
				{/if}
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
