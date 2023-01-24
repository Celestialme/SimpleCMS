<script lang="ts">
	//import { SITENAME } from '$env/static/private';

	// Icons from https://icon-sets.iconify.design/
	import Icon from '@iconify/svelte';

	// typesafe-i18n
	import { setLocale } from '@src/i18n/i18n-svelte';
	import LL from '@src/i18n/i18n-svelte';

	// skeleton
	import { menu } from '@skeletonlabs/skeleton';
</script>

<div class="container h-full mx-auto flex justify-center items-center">
	<h1>Let's get started</h1>

	<p>{$LL.HI('TEST')}</p>

	<button class="btn btn-filled-primary btn-base"
		>SimpleCMS
		<!-- {SITENAME} -->
		<Icon icon="bi:arrow-left-circle-fill" width="30" class="rotate-180" /></button
	>

	<!-- System Language Mobile -->
	<span class="relative">
		<!-- Trigger: apply the 'use:menu' action and supply the unique menu ID -->
		<button use:menu={{ menu: 'system-language' }} class="text-surface-500 dark:text-white"
			>Test Lang</button
		>

		<!-- Menu: set a matching 'data-menu-[menuId]' attribute -->
		<nav class="list-nav card p-2 dark:border" data-menu="system-language">
			<ul class="divide-y-2">
				<li>
					<button on:click={() => setLocale('en')}>EN - {$LL.SBL_English()}</button>
				</li>
				<li><button on:click={() => setLocale('de')}>DE - {$LL.SBL_German()}</button></li>
			</ul>
		</nav>
	</span>
</div>
