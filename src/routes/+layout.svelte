<script lang="ts">
	import { collection } from '@src/stores/store.svelte';
	import '../app.css';
	import '../theme.postcss';
	import 'iconify-icon';
	let { children } = $props();
	$inspect(collection());
</script>

{@render children()}
