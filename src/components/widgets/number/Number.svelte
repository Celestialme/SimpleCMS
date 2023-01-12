<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<!-- TODO:Add Number validation & Int.Number Formating(typesave-i18n?) -->
<input
	bind:value
	type="number"
	id="number"
	placeholder={field.placeholder && field.placeholder !== '' ? field.placeholder : field.title}
	class="input w-full rounded-md"
/>
