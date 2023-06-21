<script lang="ts">
	import { page } from '$app/stores';
	import { contentLanguage } from '@src/stores/load';

	contentLanguage.set($page.params.language);
</script>

<slot />
