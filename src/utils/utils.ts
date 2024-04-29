import fs from 'fs';
import Path from 'path';
import axios from 'axios';
import { get } from 'svelte/store';
import { entryData, mode, translationProgress } from '@src/stores/store';
import { collections, collection } from '@src/stores/load';
import publicConfig from '@root/config/public';
import { browser } from '$app/environment';
import _crypto from 'crypto';
import type { Schema } from '@src/collections/types';
import type { z } from 'zod';
import mongoose from 'mongoose';
import type { ImageFiles } from './types';
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
			let uuid = new mongoose.Types.ObjectId().toString();
			formData.append(uuid, object[key]);
			object[key] = { instanceof: 'File', id: uuid, ...object[key] };
		}
	};

	for (let key in getData) {
		let value = await getData[key]();
		if (!value) continue;
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
export const getGuiFields = (fieldParams: { [key: string]: any }, GuiSchema: { [key: string]: any }) => {
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
			else if (key == 'display') return ('🗑️' + val + '🗑️').replaceAll('display', 'function display');
			else if (key == 'widget') return { key: val.key, GuiFields: val.GuiFields };
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
let env_sizes = publicConfig.IMAGE_SIZES;
export const SIZES = { ...env_sizes, original: 0, thumbnail: 320 } as const;
export async function saveImage(file: File, collectionName: string): Promise<{ id: mongoose.Types.ObjectId; fileInfo: ImageFiles }> {
	if (browser) return {} as any;
	let sharp = (await import('sharp')).default;

	let fileInfo = {};

	let arrayBuffer = await file.arrayBuffer();
	let buffer = Buffer.from(arrayBuffer);
	let hash = _crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 20);
	let existing_file = await mongoose.models['image_files'].findOne({ hash: hash });
	let path = file.path || 'global';
	if (existing_file) {
		return { id: new mongoose.Types.ObjectId(existing_file._id), fileInfo: existing_file };
	}
	let { name, ext } = removeExtension(file.name);
	//original image

	let url;
	if (path == 'global') {
		url = `images/original/${hash}.${ext}`;
	} else if (path == 'unique') {
		url = `images/${collectionName}/original/${hash}.${ext}`;
	} else {
		url = `images/${path}/original/${hash}.${ext}`;
	}
	let info = await sharp(buffer).metadata();
	fileInfo = {
		hash,
		used_by: [],
		original: {
			name: file.name,
			url: '/media/' + url,
			size: file.size,
			type: file.type,
			lastModified: file.lastModified,
			width: info.width,
			height: info.height
		}
	};

	if (!fs.existsSync(Path.dirname(`${publicConfig.MEDIA_FOLDER}/${url}`))) {
		fs.mkdirSync(Path.dirname(`${publicConfig.MEDIA_FOLDER}/${url}`), { recursive: true });
	}

	fs.writeFileSync(`${publicConfig.MEDIA_FOLDER}/${url}`, buffer);
	for (let size in SIZES) {
		if (size == 'original') continue;

		const resizedImage = await sharp(buffer)
			.rotate() // Rotate image according to EXIF data
			.resize({ width: SIZES[size] })
			.toFormat('avif', { quality: 80 })
			.toBuffer({ resolveWithObject: true });
		let url;

		if (path == 'global') {
			url = `images/${size}/${hash}.avif`;
		} else if (path == 'unique') {
			url = `images/${collectionName}/${size}/${hash}.avif`;
		} else {
			url = `images/${path}/${size}/${hash}.avif`;
		}
		if (!fs.existsSync(Path.dirname(`${publicConfig.MEDIA_FOLDER}/${url}`))) {
			fs.mkdirSync(Path.dirname(`${publicConfig.MEDIA_FOLDER}/${url}`), { recursive: true });
		}
		//sized images
		fs.writeFileSync(`${publicConfig.MEDIA_FOLDER}/${url}`, resizedImage.data);
		fileInfo[size] = {
			name: `${name}.avif`,
			url: '/media/' + url,
			size: resizedImage.info.size,
			type: 'image/avif',
			lastModified: file.lastModified,
			width: resizedImage.info.width,
			height: resizedImage.info.height
		};
	}

	let res = await mongoose.models['image_files'].insertMany(fileInfo);

	return { id: new mongoose.Types.ObjectId(res[0]._id), fileInfo: fileInfo as ImageFiles };
}

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

export async function saveFormData({ data, _collection, _mode, id }: { data: any; _collection?: Schema; _mode?: 'edit' | 'create'; id?: string }) {
	let $mode = _mode || get(mode);
	let $collection = _collection || get(collection);
	let $entryData = get(entryData);
	let formData = data instanceof FormData ? data : await col2formData(data);
	if (_mode === 'edit' && !id) {
		throw new Error('ID is required for edit mode.');
	}
	if (!formData) return;

	switch ($mode) {
		case 'create':
			return await axios.post(`/api/${$collection.name}`, formData, config).then((res) => res.data);
		case 'edit':
			formData.append('_id', id || $entryData._id);
			return await axios.patch(`/api/${$collection.name}`, formData, config).then((res) => res.data);
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

function removeExtension(fileName) {
	const lastDotIndex = fileName.lastIndexOf('.');
	if (lastDotIndex === -1) {
		// If the file has no extension, return the original fileName
		return { name: fileName, ext: '' };
	}
	return { name: fileName.slice(0, lastDotIndex), ext: fileName.slice(lastDotIndex + 1) };
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
	let timer;
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

export function validateZod<T>(schema: z.Schema<T>, value?: T): null | { [P in keyof T]?: string[] | undefined } {
	let res = schema.safeParse(value);
	if (res.success || !value) {
		return null;
	} else {
		return res.error.flatten().fieldErrors as any;
	}
}

export function motion(start: number, end: number, duration: number, cb: (current: number) => void, useAnimation = true) {
	{
		let frequency = 16;
		let d = (start - end) / (duration / frequency);
		if (d === 0) {
			cb(end);
			return;
		}
		let current = start;

		return new Promise<void>((resolve) => {
			if (useAnimation) {
				function animation(current) {
					current -= d;
					if ((d < 0 && current >= end) || (d > 0 && current <= end)) {
						cb(end);
						resolve();
					} else {
						cb(current);
						requestAnimationFrame(() => animation(current));
					}
				}

				requestAnimationFrame(() => animation(current));
			} else {
				let interval = setInterval(async () => {
					current -= d;

					if ((d < 0 && current >= end) || (d > 0 && current <= end)) {
						cb(end);
						clearInterval(interval);
						resolve();
					} else {
						cb(current);
					}
				}, frequency);
			}
		});
	}
}

export function updateTranslationProgress(data, field) {
	let languages = publicConfig.AVAILABLE_CONTENT_LANGUAGES;
	let $translationProgress = get(translationProgress);
	for (let lang of languages) {
		!$translationProgress[lang] && ($translationProgress[lang] = { total: new Set(), translated: new Set() });
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
