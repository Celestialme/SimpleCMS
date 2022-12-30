<script lang="ts">
	import type { Text_Field } from './types';

	import { language } from '@src/stores/store';
	import env from '@root/env';

	export let field: Text_Field;
	export let value = {};
	export let widgetValue: any = {};
	$: !value && (value = {}); //default value

	$: widgetValue = value || {};

	$: _language = field.localization ? $language : env.LANGUAGE;
</script>

<div>
	<div class="relative mt-1 rounded-md shadow-sm">
		{#if field.prefix}
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<span class="text-gray-600 dark:text-gray-200">{field.prefix}</span>
			</div>
		{/if}

		<input
			type="text"
			name={field.title}
			id={field.title}
			class="block w-full rounded-md border-gray-300 pl-7 pr-12 sm:text-sm"
			placeholder={field.placeholder && field.placeholder !== '' ? field.placeholder : field.title}
		/>
		<!-- why is this not working ?
			right-[calc(#suffix - 12px)] 
		-->
		{#if field.count}
			{#if field.suffix}
				<div class=" absolute inset-y-0 right-9  flex items-center">
					<span class="badge mr-1 border border-gray-500 text-gray-600 dark:text-gray-200"
						>{field.count}</span
					>
				</div>
			{:else}
				<div class="absolute inset-y-0 right-0 flex items-center">
					<span class="badge mr-1 border border-gray-500 text-gray-600 dark:text-gray-200"
						>{field.count}</span
					>
				</div>
			{/if}
		{/if}

		{#if field.suffix}
			<div id="suffix" class="absolute inset-y-0 right-0 flex items-center">
				<span class="pr-2 text-gray-600 dark:text-gray-200">{field.suffix}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	@import '@skeletonlabs/skeleton/styles/all.css';
	@import '@skeletonlabs/skeleton/styles/elements.css';
	@import '@skeletonlabs/skeleton/styles/elements/badges.css';
</style>
