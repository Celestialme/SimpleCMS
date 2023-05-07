<script lang="ts">
	import { page } from '$app/stores';
	import { systemLanguage } from '@src/stores/load';

	systemLanguage.set($page.params.language);
</script>

<slot />
