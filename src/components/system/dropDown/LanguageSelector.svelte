<script lang="ts">
	import publicConfig from '@root/config/public';
	import { contentLanguage } from '@src/stores/load';
	import { mode, translationProgress } from '@src/stores/store.svelte';
	let languages = publicConfig.AVAILABLE_CONTENT_LANGUAGES;
	$contentLanguage = publicConfig.DEFAULT_CONTENT_LANGUAGE;

	let { label = '' }: { label?: string } = $props();
	let expanded = $state(false);
	mode.subscribe(() => {
		if (mode.value != 'view') translationProgress.value = { show: true };
		else translationProgress.value = { show: false };
	});
</script>

<div class="container absolute bg-[#363636]" class:expanded>
	<div
		onclick={() => (expanded = !expanded)}
		class="flex cursor-pointer items-center justify-evenly"
		class:selected={expanded}
	>
		<iconify-icon icon="clarity:language-solid" width="24"></iconify-icon>

		<p>{($contentLanguage || label).toUpperCase()}</p>
	</div>
	{#if expanded}
		<div class="items bg-[#363636]" class:itemsView={!translationProgress.value.show}>
			{#each languages as lang}
				{#if translationProgress.value.show}
					{@const percentage =
						(translationProgress.value[lang]?.translated.size * 100) /
							translationProgress.value[lang]?.total.size || 0}
					<div
						class="flex item items-center py-2"
						onclick={() => {
							$contentLanguage = lang;
							expanded = false;
						}}
					>
						<p>
							{lang.toUpperCase()}
						</p>
						<div class="w-[100px] h-[5px] bg-white">
							<div style="width:{percentage}%" class="h-[5px] bg-green-500 transition-all"></div>
						</div>
						<p>
							{percentage}%
						</p>
					</div>
				{:else}
					<p
						class="item"
						onclick={() => {
							$contentLanguage = lang;
							expanded = false;
						}}
					>
						{lang.toUpperCase()}
					</p>
				{/if}
			{/each}
		</div>
	{/if}
</div>

<style>
	.container {
		border-radius: 5px;
	}
	.expanded {
		box-shadow: 0px 0px 3px 1px #72efed;
	}
	.selected {
		border-bottom: 1px solid white;
	}
	p {
		position: relative;

		padding: 5px 10px;
		color: white;
		text-align: center;
		user-select: none;
	}
	.items {
		margin-top: 10px;
		position: absolute;
		width: 200px;
		right: 0;
		top: 100%;
		z-index: 10;
	}
	.itemsView {
		width: 100%;
		margin-top: 0;
		position: relative;
	}
	.item:hover {
		background-color: aqua;
	}
	.item {
		cursor: pointer;
		width: 100%;
		border-bottom: 1px solid rgb(153, 153, 153);
	}
</style>
