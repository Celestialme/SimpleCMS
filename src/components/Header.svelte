<script lang="ts">
	import MultiButton from './system/buttons/MultiButton.svelte';
	import XIcon from './system/icons/XIcon.svelte';
	import LanguageSelector from './system/dropDown/LanguageSelector.svelte';

	import type { User } from '@src/auth/types';
	import { page } from '$app/stores';
	import {
		collection,
		mode,
		drawerExpanded,
		headerActionButton,
		saveFunction
	} from '@src/stores/store.svelte';

	$effect(() => {
		headerActionButton.set(XIcon);
		collection();
	});
	let user: User = $page.data.user;
</script>

<div class="h-[60px] z-20 relative">
	<div class="wrapper max-md:!fixed max-md:top-0 max-md:left-0">
		<button class="text-white" onclick={() => drawerExpanded.set(!drawerExpanded())}
			><iconify-icon class="md:hidden h-[17px]" icon="mingcute:menu-fill" width="24"
			></iconify-icon></button
		>
		<div class="collection mr-auto">
			{collection()?.label || collection()?.name}
		</div>
		{#if ['edit', 'create'].includes(mode()) && collection().permissions?.[user.role]?.write != false}
			<button
				class="md:hidden h-full aspect-square justify-center flex items-center p-[20px] rounded-full bg-gray-700 mr-2"
				onclick={saveFunction().fn}
			>
				<iconify-icon width="26" style="color:#05ff05" icon="ic:sharp-save-as"></iconify-icon>
			</button>
		{/if}
		<div class="w-[80px] h-full relative mr-2">
			<LanguageSelector />
		</div>
		{#if !['edit', 'create'].includes(mode())}
			<MultiButton />
		{:else}
			{@const ActionButton = headerActionButton()}
			<button class="flex item-center justify-center" onclick={() => mode.set('view')}>
				{#if typeof ActionButton != 'string'}
					{@const SvelteComponent = ActionButton}
					<SvelteComponent />
				{:else}
					<iconify-icon width="22" class="p-[10px]" icon={ActionButton}></iconify-icon>
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
