<script lang="ts">
	import { collection, categories } from '@src/collections';
	import { collectionValue, mode, language } from '@src/stores/store';
	import { cloneData, deleteData, getFieldName, handleCancel } from '@src/utils/utils';
	import { PUBLIC_TRANSLATIONS } from '$env/static/public';
	import AnimatedHamburger from '@src/components/AnimatedHamburger.svelte';
	import Button from './system/buttons/Button.svelte';
	import { toggleLeftSidebar } from '@src/stores/store';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let fields: typeof $collection.fields | undefined = undefined;
	let asAny = (value: any) => value;

	export let root = true; // if Fields is not part of any widget.
	export let fieldsData = {};
	export let customData = {};

	export let switchSideBar = false;

	$: if (root) $collectionValue = fieldsData;
	// console.log(customData);
</script>

<div class="container text-white">
	<header class="relative flex w-full items-center justify-between border-b bg-gray-800 p-2">
		<div class="flex items-center justify-start">
			{#if !switchSideBar && $toggleLeftSidebar}
				<AnimatedHamburger width="40" />
			{/if}
			<!-- Collection type with icon -->

			<div class="mr-1 flex flex-col {!$toggleLeftSidebar ? 'ml-2' : ''}">
				{#if categories}
					<div class="mb-2 text-xs capitalize text-gray-400 dark:text-gray-300">
						{categories[0].name}
					</div>
				{/if}
				<div class="-mt-2 flex justify-start text-sm font-bold dark:text-white md:text-2xl lg:text-xl">
					{#if $collection.icon}
						<span><iconify-icon icon={$collection.icon} width="24" class="mr-1 text-red-500 sm:mr-2" /></span>
					{/if}
					{#if $collection.name || $mode}
						<div class="-mt-1 flex">
							<span class="capitalize">{$mode}:</span>
							<span class="ml-1 uppercase">{$collection.name}</span>
						</div>
					{/if}
				</div>
			</div>
		</div>

		<div class="flex items-center justify-end gap-4">
			<Button on:click={deleteData} iconLeft="icomoon-free:bin" backgroundColor="red" btnClass="circular-btn w-10 h-10 !p-0" />
			<Button on:click={cloneData} iconLeft="fa-solid:clone" backgroundColor="orange" btnClass="circular-btn w-10 h-10 !p-0" />
			<select class="rounded bg-gray-600 text-white">
				<option value="EN">EN</option>
			</select>
			<Button on:click={handleCancel} iconLeft="material-symbols:close" btnClass="circular-btn w-10 h-10 !p-0" />
		</div>
	</header>

	{#each fields || $collection.fields as field, index}
		{#if field.widget}
			{#key $collection}
				<div>
					<p>{field.label}</p>
					<svelte:component
						this={asAny(field.widget)}
						field={asAny(field)}
						bind:WidgetData={fieldsData[getFieldName(field)]}
						value={customData[getFieldName(field)]}
						{...$$props}
					/>
				</div>
			{/key}
		{/if}
	{/each}
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		width: 100%;
		height: 100%;
	}
</style>
