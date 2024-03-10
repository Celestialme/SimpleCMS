import { createPublicConfig } from './types';

export default createPublicConfig({
	SITE_NAME: 'SimpleCMS',
	AVAILABLE_CONTENT_LANGUAGES: ['en', 'de'],
	DEFAULT_CONTENT_LANGUAGE: 'en',
	AVAILABLE_SYSTEM_LANGUAGES: ['de', 'en'],
	DEFAULT_SYSTEM_LANGUAGE: 'en',
	IMAGE_SIZES: { sm: 600, md: 900, lg: 1200 },
	MEDIA_FOLDER: 'mediaFiles'
});
