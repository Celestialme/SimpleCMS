<script lang="ts">
	interface Props {
		value: any;
		widget: any;
		key: string;
	}

	let { value = $bindable(), widget, key }: Props = $props();
	value = value || null;
	$effect(() => {
		if (key == 'display' && value?.default == true) {
			value = '';
		}
	});

	const SvelteComponent = $derived(widget);
</script>

<SvelteComponent bind:value label={key} theme="dark" />
