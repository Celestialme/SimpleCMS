<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<input
	bind:value
	placeholder={field.placeholder}
	type="url"
	id="website"
	autocomplete="off"
	class="input w-full "
/>
