import { json, type RequestHandler } from '@sveltejs/kit';
import { tiktok, twitch, vimeo, youtube } from '@src/components/widgets/remoteVideo/video';

// Extracts the video ID from a YouTube URL
function getYouTubeVideoId(url: string) {
	const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
	const match = url.match(regExp);

	return match && match[2].length === 11 ? match[2] : null;
}

const url = 'https://www.youtube.com/watch?v=SYiNtefVRLY';
const videoId = getYouTubeVideoId(url);
//console.log('Video ID:', videoId);

export const POST: RequestHandler = async ({ request }) => {
	//console.log('POST function called');

	const data = await request.formData();
	const res = Object.fromEntries(data);
	const url = res.url.toString();
	//console.log('URL:', url);

	const id = getYouTubeVideoId(url);
	//console.log('Video ID:', id);

	if (id) {
		const data = await youtube(id);
		//console.log('Data:', data);

		return json({
			videoTitle: data?.videoTitle,
			videoThumbnail: data?.videoThumbnail,
			videoUrl: data?.videoUrl,
			user_name: data?.channelTitle,
			upload_date: data?.publishedAt,
			duration: data?.duration,
			width: data?.width,
			height: data?.height
		});
	} else if (url.includes('vimeo.com')) {
		// Handle Vimeo URLs here
	} else if (url.includes('tiktok.com')) {
		// Handle TikTok URLs here
	} else if (url.includes('twitch.tv')) {
		// Handle Twitch URLs here
	} else {
		return json({
			videoTitle: 'Invalid URL',
			videoThumbnail: '',
			videoUrl: ''
		});
	}
};
