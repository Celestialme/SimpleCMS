import axios from 'axios';
import { translationProgress } from '@src/stores/store.svelte';
import publicConfig from '@root/config/public';
import _crypto from 'crypto';
import type { z } from 'zod';
import mongoose from 'mongoose';
export const config = {
	headers: {
		'Content-Type': 'multipart/form-data'
	}
};

export async function find(query: object, collectionName: string) {
	if (!collectionName) return;
	let _query = JSON.stringify(query);
	return (await axios.get(`/api/find?collection=${collectionName}&query=${_query}`)).data;
}
export async function findById(id: string, collectionName: string) {
	if (!id || !collectionName) return;
	return (await axios.get(`/api/find?collection=${collectionName}&id=${id}`)).data;
}

export let asAny = (value: any) => value;

export function deepCopy(obj) {
	if (typeof obj !== 'object' || obj === null) {
		return obj;
	}

	if (obj instanceof Date) {
		return new Date(obj.getTime());
	}

	if (obj instanceof Array) {
		return obj.reduce((arr, item, i) => {
			arr[i] = deepCopy(item);
			return arr;
		}, []);
	}

	if (obj instanceof Object) {
		return Object.keys(obj).reduce((newObj, key) => {
			newObj[key] = deepCopy(obj[key]);
			return newObj;
		}, {});
	}
}

export function debounce(delay?: number) {
	let timer: NodeJS.Timeout | undefined;
	let first = true;
	return (fn: () => void) => {
		if (first) {
			fn();
			first = false;
			clearTimeout(timer);
			timer = setTimeout(() => {
				first = true;
			}, delay);
			return;
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn();
			first = true;
		}, delay);
	};
}

export function validateZod<T>(
	schema: z.Schema<T>,
	value?: T
): null | { [P in keyof T]?: string[] | undefined } {
	let res = schema.safeParse(value);
	if (res.success || !value) {
		return null;
	} else {
		return res.error.flatten().fieldErrors as any;
	}
}

export async function motion(
	start: number[],
	end: number[],
	duration: number,
	cb: (current: number[]) => void
) {
	{
		let current = [...start];
		let elapsed = 0;
		let time = Date.now();
		let has_passed = false;
		setTimeout(() => {
			has_passed = true;
		}, duration);
		return new Promise<void>((resolve) => {
			function animation(current: number[]) {
				elapsed = Date.now() - time;
				// console.log(elapsed);
				let ds = start.map((s, i) => (s - end[i]) / (duration / elapsed));

				time = Date.now();
				for (let index in ds) {
					current[index] -= ds[index];
				}

				if (has_passed) {
					cb(end);
					resolve();
					return;
				} else {
					cb(current);
					requestAnimationFrame(() => animation(current));
				}
			}

			requestAnimationFrame(() => animation(current));
		});
	}
}
export function updateTranslationProgress(data, field) {
	let languages = publicConfig.AVAILABLE_CONTENT_LANGUAGES;
	for (let lang of languages) {
		!translationProgress()[lang] &&
			(translationProgress()[lang] = { total: new Set(), translated: new Set() });
		if (field?.translated) translationProgress()[lang].total.add(field);
		if (field?.translated && data[lang]) translationProgress()[lang].translated.add(field);
		else translationProgress()[lang].translated.delete(field);
		translationProgress()[lang] = { ...translationProgress()[lang] };
	}
}

export let createRandomID = (id?: string) => {
	return id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId();
};

RegExp.escape = (string) => {
	return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};

export let toFormData = function (obj: { [key: string]: string | number }) {
	let formData = new FormData();
	for (let key in obj) {
		if (typeof obj[key] == 'string') {
			formData.append(key, obj[key] as string);
		} else {
			formData.append(key, JSON.stringify(obj[key]));
		}
	}
	return formData;
};
export function get_date() {
	let d = new Date();
	return (
		d.getFullYear() +
		'-' +
		String(d.getMonth() + 1).padStart(2, '0') +
		'-' +
		String(d.getDate()).padStart(2, '0')
	);
}
export function toISOString(date: any) {
	let d = new Date(date);
	return (
		d.getFullYear() +
		'-' +
		String(d.getMonth() + 1).padStart(2, '0') +
		'-' +
		String(d.getDate()).padStart(2, '0') +
		'T' +
		String(d.getHours()).padStart(2, '0') +
		':' +
		String(d.getMinutes()).padStart(2, '0')
	);
}
export function toStringHelper({
	field,
	data,
	path
}: {
	field: any;
	data: any[];
	path: (lang: string) => string;
}) {
	if (!data) return '';
	if (!field.translated) return path(publicConfig.DEFAULT_CONTENT_LANGUAGE);
	return publicConfig.AVAILABLE_CONTENT_LANGUAGES.reduce((acc, lang) => {
		return (acc += path(lang) + '\n');
	}, '\n');
}
