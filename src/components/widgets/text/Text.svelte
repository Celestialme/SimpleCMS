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
				<span class="text-gray-500 sm:text-sm">{field.prefix}</span>
			</div>
		{/if}

		<input
			type="text"
			name="price"
			id="price"
			class="block w-full rounded-md border-gray-300 pl-7 pr-12 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
			placeholder="0.00"
		/>

		{#if field.count}
			<div class="absolute inset-y-0 right-0 flex items-center">
				<span class="badge badge-filled-primary pr-2  text-gray-500">{field.count}</span>
			</div>
		{/if}

		{#if field.suffix}
			<div class="absolute inset-y-0 right-0 flex items-center">
				<span class="pr-2 text-gray-500">{field.suffix}</span>
			</div>
		{/if}
	</div>
</div>

<style>
	@import '@skeletonlabs/skeleton/styles/all.css';
	@import '@skeletonlabs/skeleton/styles/elements.css';
	@import '@skeletonlabs/skeleton/styles/elements/badges.css';
</style>
