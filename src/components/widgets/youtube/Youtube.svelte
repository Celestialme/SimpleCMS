<script lang="ts">
	// TODO: needs more work see poosible ypoutube example
	// https://github.com/sharu725/youtube-embed
	// https://www.sanity.io/guides/portable-text-how-to-add-a-custom-youtube-embed-block

	import env from '@root/env';

	export let field: any = undefined;
	export let value = '';

	let url: string = '';
	let thumbnail: string = '';
	let title: string = '';
	let videoId: string = 'rsmLu5nmh4g';

	export let widgetValue;
	$: widgetValue = value;

	// Grab Youtube Video information
	function handlePaste() {
		console.log('value: ' + value);

		const urlValue = value;
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = urlValue.match(regExp);
		const videoId = match && match[2].length === 11 ? match[2] : null;

		console.log('videoId: ' + videoId);
		// if (videoId) {
		// 	fetch(
		// 		`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${env.GOOGLE_API_TOKEN}&part=snippet`
		// 	)
		// 		.then((response) => response.json())
		// 		.then((data) => {
		// 			const video = data.items[0];
		// 			thumbnail = video.snippet.thumbnails.medium.url;
		// 			title = video.snippet.title;
		// 			url = `https://www.youtube.com/watch?v=${videoId}`;
		// 		});
		// }
	}
	console.log('videoId: ' + videoId);
	console.log('thumbnail: ' + thumbnail);
	console.log('title: ' + title);
	console.log('url: ' + url);
</script>

<input
	bind:value
	id="youtube-url"
	type="text"
	placeholder="Paste a YouTube URL here"
	on:blur={handlePaste}
	class="input w-full rounded-md"
/>

<a href={url} class="">
	<div class="text-base font-medium">Title: {title}</div>
	<div class="text-base font-medium">videoId: {videoId}</div>
	Image from Api not working:
	<img src={thumbnail} class="mr-4 h-12 w-12 rounded-full" alt={title} />
	Image from ytimg:

	{#if videoId != null}
		<img
			src="https://i.ytimg.com/vi/{videoId}/{thumbnail ? 'hqdefault' : 'maxresdefault'}.jpg"
			{title}
			alt="Youtube video: {title}"
			referrerpolicy="no-referrer"
		/>{/if}
</a>
