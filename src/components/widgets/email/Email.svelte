<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<!-- TODO: validation of EMAIL -->
<input
	bind:value
	type="email"
	id="email"
	placeholder={field.placeholder && field.placeholder !== '' ? field.placeholder : field.db_fieldName}
	class="input w-full rounded-md"
/>
