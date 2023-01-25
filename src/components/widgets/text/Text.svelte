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

	// let charCount: number;
	// $: charCount = widgetValue[_language].length;

	// const badgeColor = (charCount: number, minlength: number, maxlength: number): string => {
	// 	if (charCount < minlength) return 'text-gray';
	// 	if (charCount >= minlength && charCount < maxlength * 0.9) return 'text-orange-500';
	// 	if (charCount >= maxlength * 0.9 && charCount <= maxlength) return 'text-green-500';
	// 	if (charCount > maxlength) return 'text-red-500';
	// 	return 'text-gray';
	// };
</script>

<div>
	<div class="relative mt-1 rounded-md border border-surface-500 shadow-sm ">
		{#if field.prefix}
			<div class="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
				<span class="text-surface-600 dark:text-surface-200">{field.prefix}</span>
			</div>
		{/if}

		<input
			type="text"
			name={field.db_fieldName}
			id={field.db_fieldName}
			placeholder={field.placeholder && field.placeholder !== ''
				? field.placeholder
				: field.db_fieldName}
			minlength={field.minlength}
			maxlength={field.maxlength}
			required={field.required}
			disabled={field.readonly}
			bind:value={widgetValue[_language]}
			class="{field.prefix
				? 'pl-7'
				: ''} block w-full  border-surface-300 pr-12 read-only:border-2 read-only:border-error-600 read-only:bg-surface-300 read-only:placeholder-surface-900 read-only:dark:bg-surface-500 read-only:dark:placeholder-white sm:text-sm"
		/>
		<!-- why is this not working ?
			right-[calc(#suffix - 12px)] 
		-->
		{#if field.count}
			{#if field.suffix}
				<div class=" absolute inset-y-0 right-9 flex items-center">
					<span class="badge mr-1 border bg-white text-surface-600 ">
						<!-- {charCount}/{field.count} -->
						{field.count}
					</span>
				</div>
			{:else}
				<div class="absolute inset-y-0 right-0 flex items-center">
					<span class="badge mr-1 border bg-white text-surface-600 ">
						<!-- {charCount}/{field.count} -->
						{field.count}
					</span>
				</div>
			{/if}
		{/if}

		{#if field.suffix}
			<div id="suffix" class="absolute inset-y-0 right-0 flex items-center">
				<span class="pr-2 text-surface-600 dark:text-surface-200">{field.suffix}</span>
			</div>
		{/if}
	</div>
</div>
