<script lang="ts">
	import { entryData, getFieldsData, language } from '@src/stores/store';
	import env from '@root/env';
	import type { Schema } from '@src/collections/types';
	import Fields from './Fields.svelte';

	// Skeleton
	import { tooltip } from '@skeletonlabs/skeleton';
	import { menu } from '@skeletonlabs/skeleton';

	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	export let fields: Array<any> = [];
	export let collection: Schema | undefined = undefined;
	export let showFields: boolean = true;

	$: {
		$getFieldsData = new Set();
		collection;
	}

	let open = false;
</script>

<div class="fields text-dark overflow-y-auto rounded bg-white p-3 dark:bg-gray-800 dark:text-white">
	<div class="relative mb-5 flex justify-start overflow-visible font-bold ">
		<div class="flex w-full flex-col">
			<div class="mb-2 text-sm capitalize text-gray-500 dark:text-gray-300">Create</div>
			<div
				class="-mt-2 flex items-center justify-start text-sm font-bold uppercase dark:text-white md:text-xl xl:text-2xl "
			>
				<span> <Icon icon={collection?.icon} width="24" class="mr-2" /></span>{collection?.name}
			</div>
		</div>

		<span class="absolute right-14">
			<button
				use:menu={{ menu: 'ContentLang' }}
				class="btn btn-sm btn-filled-surface  flex items-center justify-center rounded-lg uppercase"
			>
				<Icon icon="bi:translate" color="dark" width="22" class="mr-1 md:mr-1" />
				{$language}
				<Icon icon="mdi:chevron-down" width="24" />
			</button>
			<nav class="list-nav card w-40 border p-4 shadow-xl" data-menu="ContentLang">
				<ul class="divide-y">
					{#each Object.keys(env.translations).filter((data) => $language != data) as _language}
						<li
							on:click={() => {
								$language = _language;
								open = false;
							}}
						>
							{env.translations[_language]}
						</li>
					{/each}
				</ul>
			</nav>
		</span>
		<button
			on:click={() => {
				showFields = false;
				$entryData = new Set();
			}}
			use:tooltip={{ content: 'Close without saving ', position: 'bottom' }}
			class="btn absolute right-0 dark:text-white"
		>
			<span class="sr-only">Close menu</span>
			<Icon icon="material-symbols:close" width="26" />
		</button>
	</div>

	<button
		on:click={() => {
			showFields = false;
			$entryData = new Set();
		}}
		use:tooltip={{ content: 'Close without saving ', position: 'bottom' }}
		class="btn absolute right-0 dark:text-white"
	>
		<span class="sr-only">Close menu</span>
		<Icon icon="material-symbols:close" width="26" />
	</button>

	{#if fields.some((field) => field.field.required)}
		<div class="text-md -mt-3 text-center text-red-500">* Required</div>
	{/if}
	<Fields {collection} {fields} />
</div>

<style>
	:global(.fields .title) {
		color: white;
	}
	.fields {
		max-height: calc(100vh - 50px);
	}
</style>
