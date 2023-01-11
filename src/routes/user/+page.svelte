<script lang="ts">
	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	//import { credentials } from "@src/stores/store";
	import CMSLogo from '../../components/icons/SimpleCMS_Logo.svelte';

	// typesafe-i18n
	import LL from '@src/i18n/i18n-svelte';

	let showPassword: boolean = false;
	let forgot: boolean = false;
	let email = '';
	let password = '';
</script>

<div class="mb-8 flex flex-row gap-2">
	<CMSLogo className="w-10" fill="red" />

	<h1 class="text-3xl font-bold dark:text-red-500">SimpleCMS - {$LL.USER_Profile()}</h1>
</div>
