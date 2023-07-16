import { writable, derived, type Writable } from 'svelte/store';
import { get } from 'svelte/store';
import { PUBLIC_SYSTEM_LANGUAGE, PUBLIC_CONTENT_LANGUAGES } from '$env/static/public';
import { setLocale } from '@src/i18n/i18n-svelte';
import type { Locales } from '@src/i18n/i18n-types';
import { loadAllLocales } from '@src/i18n/i18n-util.sync';
import type { User } from '@src/collections/Auth';

// Create a writable store for user with initial value from local storage
export let user: Writable<User> = writable();
//export let credentials: Writable<{ username: string }> = writable();

// Create a writable store for systemLanguage with initial value of PUBLIC_SYSTEM_LANGUAGE
export let systemLanguage: Writable<string> = writable(PUBLIC_SYSTEM_LANGUAGE);

// Create a writable store for contentLanguage with initial value of PUBLIC_CONTENT_LANGUAGES
export let contentLanguage = writable(Object.keys(JSON.parse(PUBLIC_CONTENT_LANGUAGES))[0]);

// Subscribe to changes in credentials store and update local storage accordingly

// Load all locales
loadAllLocales();

// Subscribe to changes in systemLanguage store and set locale accordingly
systemLanguage.subscribe((val) => {
	setLocale(val as Locales);
});

// collective data of collection
export let collectionValue: any = writable({});
export let mode: Writable<'view' | 'edit' | 'create' | 'delete' | 'publish' | 'unpublish' | 'schedule' | 'clone'> = writable('view');
export let entryData: Writable<any> = writable({});

//TODO: check deleteEntry function and ad modal to confirm deletion
export let deleteEntry: Writable<() => any> = writable(() => {});

// Store image data while editing
export const saveEditedImage: Writable<boolean> = writable(false);

// Store ListboxValue
export const storeListboxValue: Writable<string> = writable('create');

// Update screenWidth whenever the window is resized
export const screenWidth = writable(getScreenWidthName());

if (typeof window !== 'undefined') {
	// Update screenWidth whenever the window is resized
	window.addEventListener('resize', () => {
		screenWidth.set(getScreenWidthName());
	});
}

function getScreenWidthName() {
	if (typeof window === 'undefined') {
		// Return a default value when running on the server-side
		return 'desktop';
	}

	const width = window.innerWidth;
	if (width <= 567) {
		return 'mobile';
	} else if (width >= 568 && width <= 767) {
		return 'tablet';
	} else {
		return 'desktop';
	}
}

// Sidebar State Machine logic
import fsm from 'svelte-fsm';

// Create a derived store that depends on both mode and screenWidth
const initialState = derived([mode, screenWidth], ([$mode, $screenWidth]) => {
	if ($mode === 'create') {
		return getDefaultState();
	} else {
		if ($screenWidth === 'mobile') {
			return 'closed';
		} else if ($screenWidth === 'tablet') {
			return 'collapsed';
		} else {
			return 'full';
		}
	}
});

function getDefaultState() {
	if (get(screenWidth) === 'mobile') {
		return 'closed';
	} else if (get(screenWidth) === 'tablet') {
		return 'collapsed';
	} else {
		return 'full';
	}
}

export const toggleLeftSidebar = fsm(getDefaultState(), {
	closed: {
		click: (nextState) => {
			if (nextState === 'closed') {
				return 'closed';
			} else if (get(screenWidth) === 'mobile') {
				return get(userPreferredState); // use the value of userPreferredState
			} else if (get(screenWidth) === 'tablet') {
				return 'collapsed';
			} else {
				return 'full';
			}
		},
		clickSwitchSideBar: () => get(userPreferredState)
	},

	collapsed: {
		click: () => 'full',
		clickSwitchSideBar: () => 'full',
		clickBack: () => 'closed'
	},
	full: {
		click: () => {
			if (get(screenWidth) === 'mobile' || get(screenWidth) === 'tablet') {
				return 'collapsed';
			} else {
				return 'closed';
			}
		},
		clickSwitchSideBar: () => 'collapsed',
		clickBack: () => get(userPreferredState)
	}
});

export const togglePageHeader = fsm('closed', {
	closed: { open: () => 'open' },
	open: { close: () => 'closed' }
});

export const togglePageFooter = fsm('closed', {
	closed: { open: () => 'open' },
	open: { close: () => 'closed' }
});

export const toggleRightSidebar = fsm('closed', {
	closed: { open: () => 'open' },
	open: { close: () => 'closed' }
});

export let width = writable('mobile');
export let userPreferredState = writable('collapsed');

export const handleSidebarToggle = () => {
	if (get(screenWidth) === 'mobile') {
		if (get(mode) === 'view') {
			// logic for view mode on mobile
			toggleLeftSidebar.click('full');
			toggleRightSidebar.close();
			togglePageHeader.close();
			togglePageFooter.close();
		} else {
			// logic for all other modes on mobile
			toggleLeftSidebar.clickBack('closed');
			toggleRightSidebar.close();
			togglePageHeader.open();
			togglePageFooter.open();
		}
	} else if (get(screenWidth) === 'tablet') {
		if (get(mode) === 'view') {
			// logic for view mode on tablet
			toggleLeftSidebar.click('closed');
			toggleRightSidebar.close();
			togglePageHeader.close();
			togglePageFooter.close();
		} else {
			// logic for all other modes on tablet
			toggleLeftSidebar.clickBack();
			toggleRightSidebar.close();
			togglePageHeader.open();
			togglePageFooter.open();
		}
	} else if (get(screenWidth) === 'desktop') {
		if (get(mode) === 'view') {
			// logic for view mode on desktop
			toggleLeftSidebar.click('collapsed');
			toggleRightSidebar.close();
			togglePageHeader.close();
			togglePageFooter.close();
		} else {
			// logic for all other modes on desktop
			toggleLeftSidebar.click('collapsed');
			toggleRightSidebar.open();
			togglePageHeader.open();
			togglePageFooter.close();
		}
	}
};

// TODO: Add Screen/Browser resize without breaking load
// screenWidth.subscribe(($screenWidth) => {
// 	console.log('screenWidth changed:', $screenWidth);
// 	if ($screenWidth === 'mobile') {
// 		toggleLeftSidebar.click('closed');
// 	} else if ($screenWidth === 'tablet') {
// 		toggleLeftSidebar.click('collapsed');
// 	} else {
// 		toggleLeftSidebar.click('full');
// 	}
// });

export const handleSwitchSideBar = () => {
	userPreferredState.set(get(toggleLeftSidebar));
	toggleLeftSidebar.clickSwitchSideBar(); // This line changes the state of the left sidebar according to the clickSwitchSideBar transition
};
