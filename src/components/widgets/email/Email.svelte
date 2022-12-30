<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;
</script>

<input bind:value type="email" id="email" placeholder={field.placeholder} class="input w-full" />
