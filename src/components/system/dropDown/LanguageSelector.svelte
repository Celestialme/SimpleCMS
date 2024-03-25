<script lang="ts">
	import publicConfig from '@root/config/public';
	import { contentLanguage } from '@src/stores/load';
	import { mode, translationProgress } from '@src/stores/store';
	let languages = publicConfig.AVAILABLE_CONTENT_LANGUAGES;
	$contentLanguage = languages[0];
	export let label: string = '';
	let expanded = false;
	mode.subscribe(() => {
		if ($mode != 'view') $translationProgress = { show: true };
		else {
			$translationProgress = { show: false };
		}
	});
</script>

<div class="container absolute bg-[#363636]">
	<div on:click={() => (expanded = !expanded)} class="flex cursor-pointer items-center justify-evenly" class:selected={expanded}>
		<iconify-icon icon="clarity:language-solid" width="24" />

		<p>{($contentLanguage || label).toUpperCase()}</p>
	</div>
	{#if expanded}
		<div class="items bg-[#363636]" class:itemsView={!$translationProgress.show}>
			{#each languages as lang}
				{#if $translationProgress.show}
					<div
						class="flex item items-center py-2"
						on:click={() => {
							$contentLanguage = lang;
							expanded = false;
						}}
					>
						<p>
							{lang.toUpperCase()}
						</p>
						<div class="w-[100px] h-[5px] bg-white">
							<div
								style="width:{($translationProgress[lang]?.translated.size * 100) / $translationProgress[lang]?.total.size}%"
								class="h-[5px] bg-green-500 transition-all"
							></div>
						</div>
						<p>{(($translationProgress[lang]?.translated.size ?? 1) * 100) / $translationProgress[lang]?.total.size ?? 100}%</p>
					</div>
				{:else}
					<p
						class="item"
						on:click={() => {
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
