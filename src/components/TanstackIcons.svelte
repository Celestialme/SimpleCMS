<script>
	import { createEventDispatcher } from 'svelte';
	import { storeListboxValue } from '@src/stores/store';

	const dispatch = createEventDispatcher();

	export let cross = false;
	export let checked = false;

	$: if (['create', 'publish'].includes($storeListboxValue)) {
		cross = false;
	} else {
		cross = true;
	}
	$: if (['create', 'publish'].includes($storeListboxValue)) {
		checked = true;
	} else {
		checked = false;
	}

	// console.log('checked in TanstackIcons:', checked);
	// console.log('storeListboxValue in TanstackIcons:', $storeListboxValue);
</script>

<div
	class="flex h-[26px] w-[26px] items-center justify-center rounded-md border-2 border-surface-800 dark:border-surface-400 {$$props.class}"
	on:keydown
	on:click|stopPropagation={() => {
		checked = !checked;
		dispatch('iconClick');
	}}
>
	{#if checked && !cross}
		<!--Red Cross icon 3d-->
		<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 224 224">
			<mask id="a" width="224" height="224" x="0" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha">
				<path
					fill="#fff"
					d="M48 1c-6 2-11 5-26 21C2 41-1 47 1 54c2 6 7 12 31 36l23 22-26 26c-30 30-32 33-27 43 2 4 32 35 39 40 5 4 11 4 17 1l29-27 25-25 26 25 29 27c5 2 12 2 16 0l39-39c2-5 2-11 0-16-2-3-12-15-27-29l-24-26 24-25 27-29c2-5 2-12 0-16-4-6-37-38-41-40-6-3-7-3-13 0-4 2-11 8-31 28l-25 25-24-25C61 3 55-1 48 1Z"
				/>
			</mask>
			<g mask="url(#a)">
				<path
					fill="url(#b)"
					stroke="#950404"
					stroke-width="6"
					d="M48 1c-6 2-11 5-26 21C2 41-1 47 1 54c2 6 7 12 31 36l23 22-26 26c-30 30-32 33-27 43 2 4 32 35 39 40 5 4 11 4 17 1l29-27 25-25 26 25 29 27c5 2 12 2 16 0l39-39c2-5 2-11 0-16-2-3-12-15-27-29l-24-26 24-25 27-29c2-5 2-12 0-16-4-6-37-38-41-40-6-3-7-3-13 0-4 2-11 8-31 28l-25 25-24-25C61 3 55-1 48 1Z"
				/>
				<path fill="#9E120F" d="M65 208c1 1-8 7-7 9 1 1 0 2 2 2l2-1 5-4 6-5 8-7 8-9 10-11 6-7 6-7 1-2-1-2-2 1-5 5-6 5-6 6-8 8-8 8-11 11Z" />
				<path fill="url(#c)" d="M174 94c1 1-8 7-7 9 1 1 0 2 2 2l2-1 5-4 7-6 7-7 8-8 10-11 6-8 5-4 2-3-1-3h-3l-5 6-6 4-6 7-8 8-8 8-10 11Z" />
				<path fill="url(#d)" d="M49 103c0-1 8 7 10 5v-2l-5-6-5-7-8-9-9-9-11-11-8-8-8-6-1-1-2 1v3l6 6 5 6 7 8 8 8 9 10 12 12Z" />
				<path fill="url(#e)" d="M120 53c1 0-10 7-8 10l2 1 3-1 6-4 8-7 9-8 10-10 11-13 8-9 7-8 1-2-1-1h-4l-6 7-7 5-7 7-9 10-11 9-12 14Z" />
				<path fill="url(#f)" d="M12 162c1 0-10 7-8 10l2 1 3-1 6-4 8-7 9-8 10-10 11-13 8-9 7-8 1-2-1-1h-4l-6 7-7 5-7 7-9 10-11 9-12 14Z" />
				<path fill="url(#g)" d="M100 56c1 0 8 10 10 8 1-1 2 0 2-2l-1-3-5-5-7-8-8-8-10-10-13-11-9-7-8-7h-2l-2 1 1 3 6 6 6 6 7 8 10 8 9 10 14 11Z" />
				<path fill="url(#h)" d="M212 166c0-1 8 9 10 8 1-1 2-1 2-3l-1-2-5-6-7-8-8-8-10-10-13-11-9-7-8-7h-2l-2 1 1 3 6 6 6 7 7 7 10 9 9 10 14 11Z" />
				<path fill="url(#i)" d="M126 168c-1 0-7-9-9-8-1 1-2 0-2 2l1 3 4 5 6 7 7 8 9 10 12 11 8 7 7 6 2 1 1-1v-3l-6-6-4-6-7-7-8-8-9-10-12-11Z" />
			</g>
			<defs>
				<radialGradient id="b" cx="0" cy="0" r="1" gradientTransform="rotate(-90 112 0) scale(112)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stop-color="#D24644" />
					<stop offset=".2" stop-color="#D8514F" />
					<stop offset=".5" stop-color="#E24C4A" />
					<stop offset=".8" stop-color="#E04E4C" />
					<stop offset="1" stop-color="#C93331" />
				</radialGradient>
				<radialGradient id="e" cx="0" cy="0" r="1" gradientTransform="matrix(32 0 0 32 144 33)" gradientUnits="userSpaceOnUse">
					<stop stop-color="#F79496" />
					<stop offset="1" stop-color="#F78B8D" stop-opacity="0" />
				</radialGradient>
				<radialGradient id="f" cx="0" cy="0" r="1" gradientTransform="matrix(32 0 0 32 36 142)" gradientUnits="userSpaceOnUse">
					<stop stop-color="#F79496" />
					<stop offset="1" stop-color="#F78B8D" stop-opacity="0" />
				</radialGradient>
				<radialGradient id="g" cx="0" cy="0" r="1" gradientTransform="matrix(-1 -32 32 -1 79 34)" gradientUnits="userSpaceOnUse">
					<stop stop-color="#F4C8C8" />
					<stop offset="1" stop-color="#FF0302" stop-opacity="0" />
				</radialGradient>
				<radialGradient id="h" cx="0" cy="0" r="1" gradientTransform="matrix(-1 -32 32 -1 191 143)" gradientUnits="userSpaceOnUse">
					<stop stop-color="#F4C8C8" />
					<stop offset="1" stop-color="#FF0302" stop-opacity="0" />
				</radialGradient>
				<linearGradient id="c" x1="227.5" x2="141" y1="125" y2="51.5" gradientUnits="userSpaceOnUse">
					<stop stop-color="#AF0D0A" />
					<stop offset=".5" stop-color="#AF0D0A" stop-opacity=".6" />
					<stop offset="1" stop-color="#F2DAD9" stop-opacity="0" />
				</linearGradient>
				<linearGradient id="d" x1="29.7" x2="96.5" y1="107.8" y2="30.5" gradientUnits="userSpaceOnUse">
					<stop stop-color="#850E0C" />
					<stop offset=".5" stop-color="#AA1A18" stop-opacity=".6" />
					<stop offset="1" stop-color="#AF0D0A" stop-opacity="0" />
				</linearGradient>
				<linearGradient id="i" x1="153.5" x2="185" y1="212" y2="182" gradientUnits="userSpaceOnUse">
					<stop stop-color="#7B0E0C" />
					<stop offset=".2" stop-color="#AF0D0A" />
					<stop offset="1" stop-color="#FBFBFB" stop-opacity="0" />
				</linearGradient>
			</defs>
		</svg>
	{:else if cross && !checked}
		<!--Green Check icon 3d-->
		<svg xmlns="http://www.w3.org/2000/svg" baseProfile="basic" viewBox="0 0 600 600">
			<defs>
				<radialGradient id="a" cx="300" cy="300" r="292.3" gradientTransform="translate(0 5)" gradientUnits="userSpaceOnUse">
					<stop offset="0" stop-color="#008700" />
					<stop offset="1" stop-color="#006f00" />
				</radialGradient>
			</defs>
			<path fill="url(#a)" d="M8 405s115 129 138 182h99c41-126 203-429 341-535 28-37-43-52-102-27-87 36-252 317-283 384-44 12-90-73-90-73L8 405z" />
		</svg>
	{/if}
</div>
