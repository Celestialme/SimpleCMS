<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<!-- TODO:Add URL validation -->
<input
	bind:value
	placeholder={field.placeholder && field.placeholder !== '' ? field.placeholder : field.db_fieldName}
	type="url"
	id="website"
	autocomplete="off"
	class="input w-full rounded-md"
/>
