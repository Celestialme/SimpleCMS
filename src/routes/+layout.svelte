<script lang="ts">
	// Your selected Skeleton theme:
	import '../app.postcss';

	// Icons from https://icon-sets.iconify.design/
	import 'iconify-icon';

	import { page } from '$app/stores';
	import {
		avatarSrc,
		handleSidebarToggle,
	} from '@src/stores/store';


	// Use handleSidebarToggle as a reactive statement to automatically switch the correct sidebar
	$: handleSidebarToggle;

	import { contentLanguage } from '@src/stores/store';

	//smooth view transitions via browser (only chrome)
	import { PUBLIC_SITENAME } from '$env/static/public';

	contentLanguage.set($page.params.language);

	// update the handleClick function when the systemLanguage store value changes

	// typesafe-i18n

	// dark mode

	// Lucia
	const user = $page.data.user;

	avatarSrc.set(user?.avatar);

	//signOut
    console.log("root layout")

	//skeleton
	import {
		initializeStores,
	} from '@skeletonlabs/skeleton';

	initializeStores();

	//required for popups to function
	// Popup Tooltips


	// Declare a ForwardBackward variable to track whether the user is navigating using the browser's forward or backward buttons


	// Subscribe to changes in the collection store and do redirects

	// onMount(async () => {
	// 	try {
	// 		dates = await getDates($collection.name);
	// 	} catch (error) {
	// 		console.error(error);
	// 	}
	// });

	// SEO
	const SeoTitle = `${PUBLIC_SITENAME} - powered with sveltekit`;
	const SeoDescription = `${PUBLIC_SITENAME} - a modern, powerful, and easy-to-use CMS powered by SvelteKit. Manage your content with ease & take advantage of the latest web technologies.`;
</script>

<!-- <div>
	Mode <span class="font-bold text-primary-500">{$mode}</span>
</div> -->

<!-- TODO: Fix Right And mobile Version of sidebars -->
<!-- <div
	class="flex flex-wrap justify-center
 text-xs"
>
	<div class="mx-2 flex flex-col items-center">
		Mode
		<div class="font-bold text-primary-500">{$mode}</div>
	</div>
	<div class="mx-2 flex flex-col items-center">
		screenWidth
		<div class="font-bold text-primary-500">{$screenWidth}</div>
	</div>
	<div class="mx-2 flex flex-col items-center">
		userPreferredState
		<div class="font-bold text-primary-500">{$userPreferredState}</div>
	</div>
	<div class="mx-2 flex flex-col items-center">
		toggleLeftSidebar
		<div class="font-bold text-primary-500">{$toggleLeftSidebar}</div>
	</div>
	<div class="mx-2 flex flex-col items-center">
		toggleRightSidebar
		<div class="font-bold text-primary-500">{$toggleRightSidebar}</div>
	</div>
	<div class="mx-2 flex flex-col items-center">
		togglePageHeader
		<div class="font-bold text-primary-500">{$togglePageHeader}</div>
	</div>
	<div class="mx-2 flex flex-col items-center">
		togglePageFooter
		<div class="font-bold text-primary-500">{$togglePageFooter}</div>
	</div>
	<div class="mx-2 flex flex-col items-center">
		storeListboxValue
		<div class="font-bold text-primary-500">{$storeListboxValue}</div>
	</div>
</div> -->

<svelte:head>
	<!--Basic SEO-->
	<title>{SeoTitle}</title>
	<meta name="description" content={SeoDescription} />

	<!-- Open Graph -->
	<meta property="og:title" content={SeoTitle} />
	<meta property="og:description" content={SeoDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:image" content="/SimpleCMS_Logo_Round.png" />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:site_name" content={$page.url.origin} />

	<!-- Open Graph : Twitter-->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={SeoTitle} />
	<meta name="twitter:description" content={SeoDescription} />
	<meta name="twitter:image" content="/SimpleCMS_Logo_Round.png" />
	<meta property="twitter:domain" content={$page.url.origin} />
	<meta property="twitter:url" content={$page.url.href} />
</svelte:head>

<!-- Wait for dynamic Collection import -->
<!-- TODO: Optimize this as this is not needed for ever page -->
	<!-- hack as root +layout cannot be overwritten ? -->
<slot />
