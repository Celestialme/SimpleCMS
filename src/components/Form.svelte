<script lang="ts">
	export let fields: Array<any> = [];
	export let collection: Schema | undefined = undefined;
	export let showFields: boolean = true;
	import { entryData as entryData, getFieldsData } from '@src/stores/store';
	import type { Schema } from '@src/collections/types';
	import { Button, Chevron, CloseButton, Dropdown, DropdownItem, Tooltip } from 'flowbite-svelte';
	import Fields from './Fields.svelte';
	import Icon from '@iconify/svelte';

	$: {
		$getFieldsData = new Set();
		collection;
	}
	let language = 'English';
	let languages = ['English', 'German'];
	let open = false;
</script>

<div
	class="fields text-dark dark:text-white bg-white dark:bg-gray-800 p-3 rounded overflow-y-auto max-h-screen"
>
	<div class="flex justify-start mb-5 font-bold relative  overflow-visible">
		<Icon icon={collection?.icon} color="dark" width="24" class="mr-1" />Create {collection?.name}
		<Button
			pill={true}
			size="xs"
			color="light"
			class="absolute px-6 py-1 right-10 hover:bg-gray-100 dark:hover:bg-gray-700"
			><Icon icon="bi:translate" color="dark" width="22" class="mr-1" />
			<Chevron>{language}</Chevron></Button
		>
		<Dropdown bind:open>
			{#each languages as _language}
				<DropdownItem
					on:click={() => {
						language = _language;
						open = false;
					}}>{_language}</DropdownItem
				>
			{/each}
		</Dropdown>
		<Tooltip placement="bottom" color="gray">Current Content Language</Tooltip>
		<CloseButton
			class="absolute dark:text-white right-0"
			on:click={() => {
				showFields = false;
				$entryData = new Set();
			}}
		/>
		<Tooltip placement="bottom" color="!dark">Close without saving</Tooltip>
	</div>
	{#if fields.some((field) => field.field.required)}
		<div class="text-red-500 font-bold text-xs -mt-3">* Required</div>
	{/if}
	<Fields {collection} {fields} />
</div>

<style>
	:global(.fields .title) {
		color: white;
	}
</style>
