<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<input
	bind:value
	type="email"
	id="email"
	placeholder={field.placeholder && field.placeholder !== '' ? field.placeholder : field.title}
	class="input w-full rounded-md"
/>
