<script lang="ts">
	import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
	import { categories, collection, contentLanguage, toggleLeftSidebar } from '@src/stores/load';
	import { drawerExpanded, mode } from '@src/stores/store';

	import PageTitle from '@components/PageTitle.svelte';


	import MultiButton from './system/buttons/MultiButton.svelte';
	import DeleteIcon from './system/icons/DeleteIcon.svelte';
	import DropDown from './system/dropDown/DropDown.svelte';
</script>



<div class="h-[60px]">
	<div class="wrapper max-md:!fixed max-md:left-0 max-md:top-0">
		<!-- <button class="text-white" on:click={() => ($drawerExpanded = !$drawerExpanded)}
			><iconify-icon class="h-[17px] md:hidden" icon="mingcute:menu-fill" width="24" /></button
		> -->
			<!-- Row 1 for Mobile -->
	<div class="flex items-center justify-between">
		<!-- Hamburger -->
		{#if $toggleLeftSidebar === 'closed'}
			<button
				type="button"
				on:keydown
				on:click={() => {
					// console.log('Hamburger clicked');
					toggleLeftSidebar.click();
				}}
				class="variant-ghost-surface btn-icon mt-1"
			>
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}
		<!-- Collection type with icon -->
		<!-- TODO: Translate Collection Name -->
		<div class="mr-1 flex flex-col {!$toggleLeftSidebar ? 'ml-2' : 'ml-1 sm:ml-2'}">
			{#if $categories.length}<div class="mb-2 text-xs capitalize text-surface-500 dark:text-surface-300">
					{$categories[0].name}
				</div>{/if}
			<div class="-mt-2 flex justify-start text-sm font-bold uppercase dark:text-white md:text-2xl lg:text-xl">
				{#if $collection.icon}<span> <iconify-icon icon={$collection.icon} width="24" class="mr-1 text-error-500 sm:mr-2" /></span>{/if}
				{#if $collection.name}
					<div class="flex max-w-[65px] whitespace-normal leading-3 sm:mr-2 sm:max-w-none md:mt-0 md:leading-none xs:mt-1">
						{$collection?.name}
					</div>
				{/if}
			</div>
		</div>
	</div>
		<div class="relative h-full w-[50px]">
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
