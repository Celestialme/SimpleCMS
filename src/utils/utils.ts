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
			let uuid = crypto.randomUUID();
			formData.append(uuid, object[key]);
			object[key] = { instanceof: 'File', id: uuid, path: object[key].path };
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
export async function saveImages(data: { [key: string]: any }, collectionName: string) {
	if (browser) return;
	let sharp = (await import('sharp')).default;

	let parseFiles = async (data: any) => {
		for (let fieldname in data) {
			if (!(data[fieldname] instanceof File) && typeof data[fieldname] == 'object') {
				await parseFiles(data[fieldname]);
				continue;
			} else if (!(data[fieldname] instanceof File)) {
				continue;
			}

			let blob = data[fieldname] as any;
			let arrayBuffer = await blob.arrayBuffer();
			let buffer = Buffer.from(arrayBuffer);
			let hash = _crypto.createHash('sha256').update(buffer).digest('hex').slice(0, 20);
			let path = blob.path;
			let name = removeExtension(blob.name);
			//original image

			let url;
			if (path == 'global') {
				url = `images/original/${hash}-${blob.name}`;
			} else if (path == 'unique') {
				url = `images/${collectionName}/original/${hash}-${blob.name}`;
			} else {
				url = `images/${path}/original/${hash}-${blob.name}`;
			}
			data[fieldname] = {
				original: { name: `${hash}-${blob.name}`, url, size: blob.size, type: blob.type, lastModified: blob.lastModified }
			};

			if (!fs.existsSync(Path.dirname(`${publicConfig.MEDIA_FOLDER}/${url}`))) {
				fs.mkdirSync(Path.dirname(`${publicConfig.MEDIA_FOLDER}/${url}`), { recursive: true });
			}

			fs.writeFileSync(`${publicConfig.MEDIA_FOLDER}/${url}`, buffer);
			for (let size in SIZES) {
				if (size == 'original') continue;
				let fullName = `${hash}-${name}.avif`;
				const thumbnailBuffer = await sharp(buffer)
					.rotate() // Rotate image according to EXIF data
					.resize({ width: SIZES[size] })
					.toFormat('avif', { quality: 80 })
					.toBuffer();
				let url;

				if (path == 'global') {
					url = `images/${size}/${fullName}`;
				} else if (path == 'unique') {
					url = `images/${collectionName}/${size}/${fullName}`;
				} else {
					url = `images/${path}/${size}/${fullName}`;
				}
				if (!fs.existsSync(Path.dirname(`${publicConfig.MEDIA_FOLDER}/${url}`))) {
					fs.mkdirSync(Path.dirname(`${publicConfig.MEDIA_FOLDER}/${url}`), { recursive: true });
				}
				//sized images
				fs.writeFileSync(`${publicConfig.MEDIA_FOLDER}/${url}`, thumbnailBuffer);
				data[fieldname][size] = {
					name: fullName,
					url: '/media/' + url,
					size: blob.size,
					type: 'image/avif',
					lastModified: blob.lastModified
				};
			}
		}
	};

	await parseFiles(data);
}

// finds field title that matches the fieldname and returns that field
function _findFieldByTitle(schema: any, fieldname: string, found = { val: false }): any {
	for (let field of schema.fields) {
		if (field.db_fieldName == fieldname || field.label == fieldname) {
			found.val = true;

			return field;
		} else if (field.fields && field.fields.length > 0) {
			return _findFieldByTitle(field, fieldname, found);
		}
	}
	if (!found) {
		throw new Error('FIELD NOT FOUND');
	}
}

// takes an object and recursively parses any values that can be converted to JSON
export function parse(obj: any) {
	for (let key in obj) {
		try {
			if (Array.isArray(obj[key])) {
				for (let index of obj[key]) {
					obj[key][index] = JSON.parse(obj[key][index]);
				}
			} else {
				obj[key] = JSON.parse(obj[key]);
			}
		} catch (e) {}

		if (typeof obj[key] != 'string') {
			parse(obj[key]);
		}
	}
	return obj;
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
		return fileName;
	}
	return fileName.slice(0, lastDotIndex);
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
			return;
		}
		clearTimeout(timer);
		timer = setTimeout(() => {
			fn();
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
