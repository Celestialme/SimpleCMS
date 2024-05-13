import type { AvailableLanguageTag } from '../src/paraglide/runtime';

export let createPrivateConfig = (arg: {
	DB_NAME: string;
	DB_USER: string;
	DB_HOST: string;
	DB_PASSWORD: string;
	SMTP_HOST?: string;
	SMTP_PORT?: number;
	SMTP_EMAIL?: string;
	SMTP_PASSWORD?: string;
	SERVER_PORT?: number;
	BODY_SIZE_LIMIT: number;
}) => arg;
export let createPublicConfig = <
	const C,
	const A,
	S extends AvailableLanguageTag,
	const V extends { [key: string]: number }
>(arg: {
	DEFAULT_CONTENT_LANGUAGE: C;
	AVAILABLE_CONTENT_LANGUAGES: C[];
	AVAILABLE_SYSTEM_LANGUAGES: S[];
	DEFAULT_SYSTEM_LANGUAGE: NoInfer<S>;
	STORAGE_FOLDER: string;
	IMAGE_SIZES: V;
	SITE_NAME: string;
	FOLDERS: A[];
}) => arg;
type NoInfer<T> = [T][T extends any ? 0 : never];
