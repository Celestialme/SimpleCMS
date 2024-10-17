import axios from 'axios';
import { get } from 'svelte/store';
import { entryData, mode, translationProgress } from '@src/stores/store';
import { collection } from '@src/stores/load';
import publicConfig from '@root/config/public';
import _crypto from 'crypto';
import type { Schema } from '@src/collections/types';
import type { z } from 'zod';
import mongoose from 'mongoose';
import { addData, updateData } from './data';

export const config = {
	headers: {
		'Content-Type': 'multipart/form-data'
	}
};

export const col2formData = async (getData: { [Key: string]: () => any }) => {
	// used to save data
	const formData = new FormData();
	let data = {};
	let parseFiles = (object: any) => {
		for (let key in object) {
			if (!(object[key] instanceof File) && typeof object[key] == 'object') {
				parseFiles(object[key]);
				continue;
			} else if (!(object[key] instanceof File)) {
				continue;
			}
			// object[key] is file here
			let uuid = createRandomID().toString();
			formData.append(uuid, object[key]);
			object[key] = { instanceof: 'File', id: uuid, ...object[key] };
		}
	};

	for (let key in getData) {
		let value = await getData[key]();
		if (!value && value !== false) continue;
		data[key] = value;
	}

	parseFiles(data);
	for (const key in data) {
		if (typeof data[key] === 'object') {
			formData.append(key, JSON.stringify(data[key]));
		} else {
			formData.append(key, data[key]);
		}
	}
	if (!formData.entries().next().value) {
		return null;
	}
	return formData;
};
export const getGuiFields = (
	fieldParams: { [key: string]: any },
	GuiSchema: { [key: string]: any }
) => {
	let guiFields = {};
	for (let key in GuiSchema) {
		if (Array.isArray(fieldParams[key])) {
			guiFields[key] = deepCopy(fieldParams[key]);
		} else {
			guiFields[key] = fieldParams[key];
		}
	}
	return guiFields;
};
export const obj2formData = (obj: any) => {
	// used for builder.
	const formData = new FormData();
	for (const key in obj) {
		let data = JSON.stringify(obj[key], (key, val) => {
			if (!val && val !== false) return undefined;
			else if (key == 'schema') return undefined;
			else if (key == 'display' && val.default == true) return undefined;
			else if (key == 'display')
				return ('🗑️' + val + '🗑️').replaceAll('display', 'function display');
			else if (typeof val === 'function') {
				return '🗑️' + val + '🗑️';
			}
			return val;
		});
		if (!data) continue;
		formData.append(key, data);
	}
	return formData;
};

export let fieldsToSchema = (fields: Array<any>) => {
	// removes widget, so it does not set up in db
	let schema: any = {};
	for (let field of fields) {
		schema = { ...schema, ...field.schema };
	}
	delete schema.widget;
	return schema;
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

export function getFieldName(field: any, sanitize = false) {
	if (sanitize) {
		return (field?.db_fieldName || field?.label)?.replaceAll(' ', '_');
	}
	return (field?.db_fieldName || field?.label) as string;
}

export async function saveFormData({
	data,
	_collection,
	_mode,
	id
}: {
	data: any;
	_collection?: Schema;
	_mode?: 'edit' | 'create';
	id?: string;
}) {
	let $mode = _mode || get(mode);
	let $collection = _collection || get(collection);
	let $entryData = get(entryData);
	let formData = data instanceof FormData ? data : await col2formData(data);
	if (_mode === 'edit' && !id) {
		throw new Error('ID is required for edit mode.');
	}
	if (!formData) return;
	if (!meta_data.is_empty()) formData.append('_meta_data', JSON.stringify(meta_data.get()));
	switch ($mode) {
		case 'create':
			return await addData({ data: formData, collectionName: $collection.path as any });
		case 'edit':
			formData.append('_id', id || $entryData._id);
			return await updateData({ data: formData, collectionName: $collection.path as any });
	}
}

export async function extractData(fieldsData: any): Promise<{ [key: string]: any }> {
	// exracts data from fieldsData because FieldsData is async
	let temp = {};
	for (let key in fieldsData) {
		temp[key] = await fieldsData[key]();
	}
	return temp;
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
	let $translationProgress = get(translationProgress);
	for (let lang of languages) {
		!$translationProgress[lang] &&
			($translationProgress[lang] = { total: new Set(), translated: new Set() });
		if (field?.translated) $translationProgress[lang].total.add(field);
		if (field?.translated && data[lang]) $translationProgress[lang].translated.add(field);
		else $translationProgress[lang].translated.delete(field);
	}
	translationProgress.set($translationProgress);
}

export let get_elements_by_id = {
	//this function is used to get elements by id together at the end to minimize calls to database.
	store: {},
	add(collection, id, callback) {
		if (!collection || !id) return;
		if (!this.store[collection]) {
			this.store[collection] = {};
		}
		if (!this.store[collection][id]) {
			this.store[collection][id] = [callback];
		} else {
			this.store[collection][id].push(callback);
		}
	},
	async getAll() {
		let store = this.store;
		this.store = {};
		for (let collection in store) {
			let ids = Object.keys(store[collection]);
			let data = await mongoose.models[collection].find({ _id: { $in: ids } });

			for (let doc in data) {
				for (let callback of store[collection][data[doc]._id.toString()]) {
					callback(data[doc]);
				}
			}
		}
	}
};

export let createRandomID = (id?: string) => {
	return id ? new mongoose.Types.ObjectId(id) : new mongoose.Types.ObjectId();
};

export let meta_data: {
	meta_data: { [key: string]: any };
	add: (key: 'storage_images_remove', data: string[]) => void;
	clear: () => void;
	get: () => { [key: string]: any };
	is_empty: () => boolean;
} = {
	meta_data: {},
	add(key, data) {
		switch (key) {
			case 'storage_images_remove':
				if (!this.meta_data?.storage_images) this.meta_data.storage_images = { removed: [] };
				this.meta_data.storage_images.removed.push(...data);
				break;
		}
	},
	get() {
		return this.meta_data;
	},
	clear() {
		this.meta_data = {};
	},
	is_empty() {
		return Object.keys(this.meta_data).length === 0;
	}
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
