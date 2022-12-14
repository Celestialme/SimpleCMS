<script lang="ts">
	import { Badge, ButtonGroup, Input, InputAddon, Helper } from 'flowbite-svelte';
	import type { Colors } from 'flowbite-svelte/types';
	import {language} from "@src/stores/store"
	export let field: any = undefined;
	export let value:{};
	export let widgetValue:any = {};
	$:console.log(value)
	$: widgetValue= value
	let BadgeColor = 'dark' as Colors;
</script>

<ButtonGroup class="w-full">
	{#if field.prefix}<InputAddon>{field.prefix}</InputAddon>{/if}

	<Input id="input-text" type="text" placeholder={field.placeholder} bind:value={ widgetValue[$language]} />

	{#if field.count}
		<InputAddon size="sm" defaultClass="bg-primary"
			><Badge rounded large color={BadgeColor} class="border border-gray-500">
				{field.count}</Badge
			></InputAddon
		>{/if}

	{#if field.suffix}
		<InputAddon>{field.suffix}</InputAddon>
	{/if}
</ButtonGroup>

{#if field.validation}
	<Helper color="red" class="mt-1">
		{field.validation}
	</Helper>
{/if}
