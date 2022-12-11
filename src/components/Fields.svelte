<script lang="ts">
	import { prevFormData, getFieldsData } from '@src/stores/store';
	import type { Schema } from '@src/collections/types';
	import { onMount } from 'svelte';
	import Icon from '@iconify/svelte';
	export let root: boolean = true; // if field is not nested. eg. not part of menu's fields
	export let fields: Array<any> = [];
	export let value: any = undefined;
	export let collection: Schema | undefined = undefined;
	export let inputFields: Array<HTMLDivElement> = [];
	export let fieldsValue: any = {};
	export let getData = async () => {
		return fieldsValue;
	};

	onMount(async () => {
		$getFieldsData.add(getData);
	});
</script>

{#each fields as field, index}
	<div bind:this={inputFields[index]} class="section my-2 relative">
		<div class=" font-bold flex capitalize relative">
			<p class=" font-bold">
				{field.field.title}
				{#if field.field.required}
					<span class="text-red-500 ml-1 pb-3">*</span>
				{/if}
			</p>
			<div class="absolute right-0 flex gap-4">
				{#if field.field.localization}
					<div class="flex items-center px-2 gap-1">
						<Icon icon="bi:translate" color="dark" width="18" class="text-sm" />
					</div>
				{/if}
				{#if field.field.icon}
					<Icon icon={field.field.icon} color="dark" width="22" class="w-10" />
				{:else}
					<div class="w-[40px]" />
				{/if}
			</div>
		</div>
		{#if field.widget}
			<svelte:component
				this={field.widget}
				{collection}
				bind:widgetValue={fieldsValue[field.field.title]}
				{root}
				value={value ? value?.[field.field.title] : $prevFormData?.[field.field.title] || ''}
				field={field.field}
			/>
		{/if}
	</div>
{/each}
