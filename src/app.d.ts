// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
import type { PipelineStage } from 'mongoose';
import type { User } from './auth/types';
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			user: User;
			error?: { status: number; message: string };
		}
		// interface PageData {}
		// interface Platform {}
	}

	type DISPLAY = (({
		data: any,
		collection: any,
		field: any,
		entry: any,
		contentLanguage: string
	}) => Promise<any>) & { default?: boolean };

	type modifiers = ({
		field,
		contentLanguage,
		filter,
		sort
	}: {
		field: any;
		contentLanguage: string;
		filter: string;
		sort: number;
	}) => Promise<PipelineStage[]>;

	interface RegExpConstructor {
		escape(str: string): string;
	}
}
export {};
