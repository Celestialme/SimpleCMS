<script lang="ts">
	import { collection, categories } from '@src/collections';
	import {
		collectionValue,
		mode,
		switchSideBar,
		toggleLeftSidebar,
		toggleRightSidebar,
		toggleHeaderSidebar,
		toggleFooterSidebar,
		language
	} from '@src/stores/store';
	import { cloneData, deleteData, getFieldName } from '@src/utils/utils';

	import { PUBLIC_TRANSLATIONS } from '$env/static/public';

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
			// For mobile toggle Header/Footer Sidebars
			toggleLeftSidebar.set(true);
			switchSideBar.set(false);
			toggleHeaderSidebar.set(false);
			toggleFooterSidebar.set(false);
			toggleRightSidebar.set(true);
		} else if (width >= 568 && width <= 767) {
			// use switchSideBar for md
			toggleLeftSidebar.set(false);
			switchSideBar.set(false);
			toggleHeaderSidebar.set(false);
			toggleFooterSidebar.set(false);
			toggleRightSidebar.set(true);
		} else if (width > 768) {
			// use toggleRightSidebar for xl and above
			toggleLeftSidebar.set(false);
			switchSideBar.set(true);
			toggleHeaderSidebar.set(false);
			toggleFooterSidebar.set(false);
			toggleRightSidebar.set(true);
		}
	}
</script>

<header class="relative flex w-full items-center justify-between border-b bg-white p-2 border-secondary-600-300-token dark:bg-surface-700">
	<div class="flex items-center justify-start">
		{#if $toggleLeftSidebar === true}
			<button type="button" on:click={() => toggleLeftSidebar.update((value) => !value)} class="btn-icon variant-ghost-surface mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}

		<!-- Collection type with icon -->
		<div class="mr-1 flex flex-col {!$toggleLeftSidebar ? 'ml-2' : 'ml-1'}">
			{#if categories}
				<div class="mb-2 text-xs capitalize text-gray-400 dark:text-gray-300">
					<span class="capitalize text-primary-500">{$mode}:</span>
					{categories[0].name}
				</div>
			{/if}

			<div class="-mt-2 flex items-center justify-start text-sm font-bold dark:text-white md:justify-center md:text-2xl lg:text-xl">
				{#if $collection.icon}
					<span><iconify-icon icon={$collection.icon} width="24" class="mr-1 text-error-500 sm:mr-2" /></span>
				{/if}

				{#if $collection.name || $mode}
					<div class="-mt-1 flex-col space-y-1">
						<span class="ml-1 uppercase">{$collection.name}</span>
					</div>
				{/if}
			</div>
		</div>
	</div>

	<div class="flex items-center justify-end gap-1 sm:gap-2 md:gap-4">
		<button type="button" on:click={deleteData} class="variant-filled-error btn-icon">
			<iconify-icon icon="icomoon-free:bin" width="24" />
		</button>

		<button type="button" on:click={cloneData} class="h btn-icon variant-filled-secondary">
			<iconify-icon icon="fa-solid:clone" width="24" />
		</button>

		<select class="variant-ghost-surface rounded border-surface-500 text-white">
			<option value="EN">EN</option>
		</select>

		<button type="button" on:click={handleCancel} class="btn-icon variant-ghost-surface">
			<iconify-icon icon="material-symbols:close" width="24" />
		</button>
	</div>
</header>

<div class="py-1 text-center text-xs text-error-500">* Required</div>
<div class="m-2">
	{#each fields || $collection.fields as field, index}
		<!-- widget width -->
		<!-- <div
	bind:this={inputFields[index]}
	class="section relative my-2 {!field.width ? 'w-full' : 'max-md:!w-full'}"
	style={field.width && `width:${field.width.replace('%', '') * 1 - 1}%`}
> -->
		{#if field.widget}
			{#key $collection}
				<div>
					<!-- Widget label -->
					<div class=" mb-0.5 flex items-center justify-between">
						<!-- db_fieldName or label  -->
						<!-- TODO: Get translated Name -->
						<p class="font-semibold capitalize">
							{#if field.label}
								{field.label}
							{:else}
								{field.db_fieldName}
							{/if}
							{#if field.required}
								<span class="ml-1 pb-3 text-error-500">*</span>
							{/if}
						</p>

						<div class="flex gap-2">
							<!-- Widget localization  -->
							{#if field.localization}
								<div class="flex items-center gap-1 px-2">
									<iconify-icon icon="bi:translate" color="dark" width="18" class="text-sm" />
									<div class="text-xs font-normal text-error-500">
										{JSON.parse(PUBLIC_TRANSLATIONS)['en']}
									</div>
								</div>
							{/if}

							<!-- Widget icon -->
							{#if field.icon}
								<iconify-icon icon={field.icon} color="dark" width="22" class="" />
							{/if}
						</div>
					</div>

					<!-- Widget Input -->
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
