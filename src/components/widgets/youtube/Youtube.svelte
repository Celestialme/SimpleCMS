<script lang="ts">
	// TODO: needs more work see poosible ypoutube example
	// https://www.sanity.io/guides/portable-text-how-to-add-a-custom-youtube-embed-block

	import env from '@root/env';

	export let field: any = undefined;
	export let value = '';

	let url: string = '';
	let thumbnail: string = '';
	let title: string = '';

	export let widgetValue;
	$: widgetValue = value;

	// Grab Youtube Video information
	function handlePaste() {
		const urlValue = value;
		const videoId = getVideoId(urlValue);
		fetch(
			`https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${env.GOOGLE_API_TOKEN}&part=snippet`
		)
			.then((response) => response.json())
			.then((data) => {
				const video = data.items[0];
				thumbnail = video.snippet.thumbnails.medium.url;
				title = video.snippet.title;
				url = `https://www.youtube.com/watch?v=${videoId}`;
			});
	}

	function getVideoId(url) {
		const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
		const match = url.match(regExp);
		return match && match[2].length === 11 ? match[2] : null;
	}
</script>

<input
	bind:value
	id="youtube-url"
	type="text"
	placeholder="Paste a YouTube URL here"
	on:input={handlePaste}
	class="input w-full rounded-md"
/>

<a href={url} class="flex items-center">
	<img src={thumbnail} class="mr-4 h-12 w-12 rounded-full" alt={title} />
	<div class="text-base font-medium">{title}</div>
</a>
