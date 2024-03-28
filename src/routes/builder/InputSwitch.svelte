<script lang="ts">
	import { sanitizePermissions } from '@src/collections/types';

	export let value;
	export let widget: any;
	export let key: string;

	$: if (key == 'display' && value?.default == true) {
		value = '';
	}
	$: if (key == 'permissions' && value) {
		value = sanitizePermissions(value);
	}
</script>

<svelte:component this={widget} bind:value label={key} theme="dark" />
