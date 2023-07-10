<script lang="ts">
	import { collection, categories } from '@src/collections';
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
</script>

<header class="relative flex w-full items-center justify-between border-b bg-white p-2 border-secondary-600-300-token dark:bg-surface-700">
	<div class="flex items-center justify-start">
		{#if $toggleLeftSidebar === 'closed'}
			<button type="button" on:click={() => toggleLeftSidebar.click()} class="btn-icon variant-ghost-surface mt-1">
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
		{#if $screenWidth !== 'desktop'}
			<!-- Save Content -->
			<button type="button" on:click={saveData} class="btn variant-filled-primary">
				<iconify-icon icon="material-symbols:save" width="24" />
				Save {$collection.name}
			</button>
			{#if $screenWidth === 'mobile'}
				<!-- Delete Content -->
				<button type="button" on:click={$deleteEntry} class="btn variant-filled-error">
					<iconify-icon icon="icomoon-free:bin" width="24" />Delete {$collection.name}
				</button>
			{/if}

			<!-- Delete Content -->
			<button type="button" on:click={deleteData} class="btn-icon variant-filled-error">
				<iconify-icon icon="icomoon-free:bin" width="24" />
			</button>

			<!-- Clone Content -->
			{#if $mode == 'edit'}
				<button type="button" on:click={cloneData} class="h btn-icon variant-filled-secondary">
					<iconify-icon icon="fa-solid:clone" width="24" />
				</button>
			{/if}
		{/if}

		<!-- TODO: Show translation Status -->

		<!-- Select Content Language -->
		<!-- Mobile -->
		<select class="variant-ghost-surface rounded border-surface-500 text-white md:hidden" bind:value={$contentLanguage} on:change={handleChange}>
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
