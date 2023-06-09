<script lang="ts">
	import { collection, categories } from '@src/collections';
	import { collectionValue, mode, switchSideBar, toggleLeftSidebar, toggleRightSidebar, language } from '@src/stores/store';
	import { cloneData, deleteData, getFieldName } from '@src/utils/utils';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	export let fields: typeof $collection.fields | undefined = undefined;
	let asAny = (value: any) => value;

	export let root = true; // if Fields is not part of any widget.
	export let fieldsData = {};
	export let customData = {};

	$: if (root) $collectionValue = fieldsData;

	// a function to undo the changes made by handleButtonClick
	function handleCancel() {
		mode.set('view');
		// get the current window width
		let width = window.innerWidth;
		// use the custom screens
		if (width <= 567) {
			// use toggleLeftSidebar for mobile
			toggleLeftSidebar.update((value) => !value);
			toggleRightSidebar.update((value) => !value);
		} else if (width >= 568 && width <= 767) {
			// use switchSideBar for md
			switchSideBar.update((value) => !value);
			toggleRightSidebar.update((value) => !value);
		} else if (width > 768) {
			// use toggleRightSidebar for xl and above
			toggleRightSidebar.update((value) => !value);
		}
	}
</script>

<header class="bg-surface-1200 relative flex w-full items-center justify-between border-b p-2 border-secondary-600-300-token dark:bg-surface-700">
	<div class="flex items-center justify-start">
		{#if $toggleLeftSidebar === true}
			<button type="button" on:click={() => toggleLeftSidebar.update((value) => !value)} class="variant-ghost-surface btn-icon mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}

		<!-- Collection type with icon -->
		<div class="mr-1 flex flex-col {!$toggleLeftSidebar ? 'ml-2' : 'ml-1'}">
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
		<button type="button" on:click={deleteData} class="variant-filled-error btn-icon">
			<iconify-icon icon="icomoon-free:bin" width="24" />
		</button>

		<button type="button" on:click={cloneData} class="btn-icon variant-filled-secondary">
			<iconify-icon icon="fa-solid:clone" width="24" />
		</button>

		<select class="variant-ghost-surface rounded text-white">
			<option value="EN">EN</option>
		</select>

		<button type="button" on:click={handleCancel} class="variant-ghost-surface btn-icon">
			<iconify-icon icon="material-symbols:close" width="24" />
		</button>
	</div>
</header>

<div class="m-2">
	{#each fields || $collection.fields as field, index}
		{#if field.widget}
			{#key $collection}
				<div>
					<p class="capitalize">{field.label}</p>
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
