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

	type DISPLAY = ({
		data: any,
		collection: any,
		field: any,
		entry: any,
		contentLanguage: string
	}) => Promise<any>;
	type ObjectId = mongoose.Types.ObjectId;
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
	}) => {
		lookup?: {
			from: string;
			localField: string;
			foreignField: string;
			as: string;
		};
		sort?: {
			[key: string]: number;
		};
		match?: {
			[key: string]: {
				value: string;
				strict: boolean;
			};
		};
		skip?: number;
		limit?: number;
	};

	interface RegExpConstructor {
		escape(str: string): string;
	}
}
export {};
