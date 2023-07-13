<script lang="ts">
	import { collection, categories } from '@src/collections/index';
	import { collectionValue, deleteEntry, mode, screenWidth, toggleLeftSidebar, handleSidebarToggle, contentLanguage } from '@src/stores/store';
	import { cloneData, deleteData } from '@src/utils/utils';
	import { PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
	import { saveFormData } from '@src/utils/utils';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	// Manually parse the object from JSON string
	let options = JSON.parse(PUBLIC_CONTENT_LANGUAGES.replace(/'/g, '"'));

	function handleChange(event) {
		const selectedLanguage = event.target.value.toLowerCase();
		contentLanguage.set(selectedLanguage);
	}

	async function saveData() {
		await saveFormData({ data: $collectionValue });

		// a function to undo the changes made by handleButtonClick
		mode.set('view' || 'edit');
		handleSidebarToggle();
	}

	// a function to undo the changes made by handleButtonClick
	function handleCancel() {
		mode.set('view');
		handleSidebarToggle();
	}

	export let showMore = false;
</script>

<header class="relative flex w-full items-center justify-between border-b bg-white p-2 border-secondary-600-300-token dark:bg-surface-700">
	<div class="flex items-center justify-start">
		<!-- hamburger -->
		{#if $toggleLeftSidebar === 'closed'}
			<button type="button" on:click={() => toggleLeftSidebar.click()} class="btn-icon variant-ghost-surface mt-1">
				<iconify-icon icon="mingcute:menu-fill" width="24" />
			</button>
		{/if}

		<!-- Collection type with icon -->
		<div class="mr-1 flex {!$toggleLeftSidebar ? 'ml-2' : 'ml-0'}">
			{#if $collection.icon}
				<div class="flex items-center justify-center">
					<iconify-icon icon={$collection.icon} width="24" class="text-error-500" />
				</div>
			{/if}
			{#if categories}
				<div class="ml-2 flex flex-col text-left text-gray-400 dark:text-gray-300">
					<div class="text-sm font-bold uppercase text-primary-500">{$mode}:</div>
					<div class="text-xs capitalize">
						{categories[0].name} <span class=" uppercase text-primary-500">{$collection.name}</span>
					</div>
				</div>
			{/if}
		</div>
	</div>

	<div class="flex items-center justify-end gap-1 sm:gap-2 md:gap-4">
		{#if $screenWidth !== 'desktop'}
			<!-- Save Content -->
			<button type="button" on:click={saveData} class="btn-icon variant-filled-primary md:btn">
				<iconify-icon icon="material-symbols:save" width="24" />
				<span class="hidden md:block">Save</span>
			</button>

			{#if $screenWidth === 'mobile'}
				<button type="button" on:keydown on:click={() => (showMore = !showMore)} class="btn-icon variant-ghost-surface sm:hidden">
					<iconify-icon icon="material-symbols:filter-list-rounded" width="30" />
				</button>
			{/if}

			{#if showMore}
				<!-- Delete Content -->
				<button type="button" on:click={$deleteEntry} class="btn-icon variant-filled-error">
					<!--<iconify-icon icon="icomoon-free:bin" width="24" />Delete-->
					<iconify-icon icon="icomoon-free:bin" width="24" />
				</button>

				<!-- Delete Content -->
				<!--<button type="button" on:click={deleteData} class="btn-icon variant-filled-error">-->
				<!--	<iconify-icon icon="icomoon-free:bin" width="24" />-->
				<!--</button>-->

				<!-- Clone Content -->
				{#if $mode == 'edit'}
					<button type="button" on:click={cloneData} class="btn-icon variant-filled-secondary">
						<iconify-icon icon="fa-solid:clone" width="24" />
					</button>
				{/if}
			{:else}
				<!-- Delete Content -->
				<button type="button" on:click={$deleteEntry} class="btn-icon variant-filled-error">
					<!--<iconify-icon icon="icomoon-free:bin" width="24" />Delete-->
					<iconify-icon icon="icomoon-free:bin" width="24" />
				</button>
				<!-- Clone Content -->
				{#if $mode == 'edit'}
					<button type="button" on:click={cloneData} class="btn-icon variant-filled-secondary">
						<iconify-icon icon="fa-solid:clone" width="24" />
					</button>
				{/if}
			{/if}
		{/if}

		<!-- TODO: Show translation Status -->

		<!-- Select Content Language -->
		<!-- Mobile -->
		<select
			class="sm:appearance-auto variant-ghost-surface m-0 appearance-none rounded border-surface-500 text-white md:hidden"
			bind:value={$contentLanguage}
			on:change={handleChange}
		>
			{#each Object.keys(options) as value}
				<option {value}>{value.toUpperCase()}</option>
			{/each}
		</select>

		<!-- Desktop -->
		<select
			class="variant-ghost-surface hidden rounded border-surface-500 text-white md:block"
			bind:value={$contentLanguage}
			on:change={handleChange}
		>
			{#each Object.entries(options) as [value, label]}
				<option {value}>{label}</option>
			{/each}
		</select>

		<!-- Cancel -->
		<button type="button" on:click={handleCancel} class="btn-icon variant-ghost-surface">
			<iconify-icon icon="material-symbols:close" width="24" />
		</button>
	</div>
</header>
