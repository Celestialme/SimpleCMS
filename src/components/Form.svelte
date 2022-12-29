<script lang="ts">
	export let fields: Array<any> = [];
	export let collection: Schema | undefined = undefined;
	export let showFields: boolean = true;
	import { entryData, getFieldsData, language } from '@src/stores/store';
	import env from '@root/env';
	import type { Schema } from '@src/collections/types';
	import { Button, Chevron, CloseButton, Dropdown, DropdownItem, Tooltip } from 'flowbite-svelte';
	import Fields from './Fields.svelte';
	import Icon from '@iconify/svelte';

	$: {
		$getFieldsData = new Set();
		collection;
	}

	let open = false;
</script>

<div class="fields text-dark overflow-y-auto rounded bg-white p-3 dark:bg-gray-800 dark:text-white">
	<div class="relative mb-5 flex justify-start overflow-visible font-bold ">
		<div class="flex w-80 flex-col">
			<div class="mb-2 text-sm capitalize text-gray-400">Create</div>
			<div
				class="-mt-2 flex items-center justify-start text-sm font-bold uppercase dark:text-white md:text-xl xl:text-2xl "
			>
				<span> <Icon icon={collection?.icon} width="24" class="mr-2" /></span>{collection?.name}
			</div>
		</div>

		<Button
			pill={true}
			size="sm"
			color="light"
			class="absolute right-14 px-6 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 md:w-[200px]"
			><Icon icon="bi:translate" color="dark" width="22" class="mr-1" />
			<Chevron>{env.translations[$language]}</Chevron></Button
		>
		<Dropdown bind:open>
			{#each Object.keys(env.translations) as _language}
				<DropdownItem
					on:click={() => {
						$language = _language;
						open = false;
					}}>{env.translations[_language]}</DropdownItem
				>
			{/each}
		</Dropdown>
		<Tooltip placement="bottom" color="gray">Current Content Language</Tooltip>

		<CloseButton
			class="absolute right-0  dark:text-white  "
			on:click={() => {
				showFields = false;
				$entryData = new Set();
			}}
		/>
		<Tooltip placement="bottom" class="z-20">Close without saving</Tooltip>
	</div>
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
