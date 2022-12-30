<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<div class="mb-4 flex items-center">
	<input
		id="default-checkbox"
		type="checkbox"
		color={field.color}
		bind:value
		class="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:ring-offset-gray-800 dark:focus:ring-blue-600"
	/>
	<label for="default-checkbox" class="ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
		>{field.title}</label
	>
</div>
