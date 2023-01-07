<script>
	import '@skeletonlabs/skeleton/themes/theme-skeleton.css';
	import '../app.css';

	// Store for Languages
	import { language } from '@src/stores/store';

	// Typesave-i18n modules
	import { setLocale } from '../i18n/i18n-svelte';
	import { loadAllLocales } from '../i18n/i18n-util.sync';

	// needed to load in memory all localized string
	loadAllLocales();

	// set the current locale globally, can be used inside components
	$: if ($language === 'en' || $language === 'de') {
		setLocale($language);
	} else {
		setLocale('en');
	}
</script>

<slot />

<style>
	@import '@skeletonlabs/skeleton/styles/all.css';
	@import '@skeletonlabs/skeleton/styles/elements.css';
	@import '@skeletonlabs/skeleton/styles/elements/tables.css';
	@import '@skeletonlabs/skeleton/styles/elements/badges.css';
	@import '@skeletonlabs/skeleton/styles/elements/cards.css';
</style>
