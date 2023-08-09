import fs from 'fs';

import collections, { collection } from '../collections';
import { Blob } from 'buffer';
import type { Schema } from '@src/collections/types';
import axios from 'axios';
import { get } from 'svelte/store';
import { entryData, mode } from '@src/stores/store';
import type { Auth } from 'lucia-auth';
import type { User } from '@src/collections/Auth';
import { PUBLIC_MEDIA_FOLDER, PUBLIC_IMAGE_SIZES } from '$env/static/public';
import { browser } from '$app/environment';
export const config = {
	headers: {
		'Content-Type': 'multipart/form-data'
	}
};

export const col2formData = async (getData: { [Key: string]: () => any }) => {
	const formData = new FormData();
	let data = {};
	for (let key in getData) {
		let value = await getData[key]();
		if (!value) continue;
		data[key] = value;
	}
	for (const key in data) {
		if (data[key] instanceof FileList) {
			for (let _key in data[key]) {
				// for multiple files
				console.log(data[key]);
				formData.append(key, data[key][_key]);
			}
		} else if (typeof data[key] === 'object') {
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
export const obj2formData = (obj: any) => {
	const formData = new FormData();
	for (const key in obj) {
		formData.append(
			key,
			JSON.stringify(obj[key], (key, val) => {
				if (!val && val !== false) return undefined;
				else if (key == 'schema') return undefined;
				else if (key == 'display' && val.default == true) return undefined;
				else if (key == 'display') return '🗑️' + val + '🗑️';
				else if (key == 'widget') return { key: val.key };
				else if (key == 'relation') return '🗑️' + val + '🗑️';
				else if (typeof val === 'function') {
					return '🗑️' + val + '🗑️';
				}
				return val;
			})
		);
	}
	return formData;
};
export async function saveFiles(data: FormData, collectionName: string) {
	if (browser) return;
	let sharp = (await import('sharp')).default;
	let files: any = {};
	let _files: Array<any> = [];
	console.log(PUBLIC_IMAGE_SIZES);
	let env_sizes = JSON.parse(PUBLIC_IMAGE_SIZES) as { [key: string]: number };
	const SIZES = { ...env_sizes, original: 0, thumbnail: 320 } as const;

	let collection = collections.find((collection) => collection.name === collectionName);
	for (let [fieldname, fieldData] of data.entries()) {
		if (fieldData instanceof Blob) {
			_files.push({ blob: fieldData, fieldname });
		}
	}

	for (let file of _files) {
		let { blob, fieldname } = file;
		let name = removeExtension(blob.name);
		let path = _findFieldByTitle(collection, fieldname).path;
		let url = `/media/${path}/${collectionName}/original/${blob.name}`;
		files[fieldname as keyof typeof files] = {
			original: { name: blob.name, url, size: blob.size, type: blob.type, lastModified: blob.lastModified }
		};

		if (!fs.existsSync(`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}`)) {
			for (let size in SIZES) {
				fs.mkdirSync(`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}/${size}`, { recursive: true });
			}
		}
		for (let size in SIZES) {
			if (size == 'original') continue;
			let fullName = `${name}.avif`;
			let arrayBuffer = await blob.arrayBuffer();
			const thumbnailBuffer = await sharp(Buffer.from(arrayBuffer))
				.rotate() // Rotate image according to EXIF data
				.resize({ width: SIZES[size] })
				.toFormat('avif', { quality: 80 })
				.toBuffer();
			fs.writeFileSync(`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}/${size}/${fullName}`, thumbnailBuffer);
			let url = `/media/${path}/${collectionName}/${size}/${fullName}`;
			files[fieldname as keyof typeof files][size] = {
				name: fullName,
				url,
				size: blob.size,
				type: 'image/avif',
				lastModified: blob.lastModified
			};
		}
		(blob as Blob).arrayBuffer().then((arrayBuffer) => {
			fs.writeFileSync(`${PUBLIC_MEDIA_FOLDER}/${path}/${collectionName}/original/${blob.name}`, Buffer.from(arrayBuffer));
		});
	}
	return files;
}

// finds field title that matches the fieldname and returns that field
function _findFieldByTitle(schema: any, fieldname: string, found = { val: false }): any {
	for (let field of schema.fields) {
		console.log('field is ', field.db_fieldName, field.label);
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

export async function find(query: object, collection: Schema) {
	if (!collection) return;
	let _query = JSON.stringify(query);
	return (await axios.get(`/api/find?collection=${collection.name}&query=${_query}`)).data;
}
export async function findById(id: string, collection: Schema) {
	if (!id || !collection) return;
	return (await axios.get(`/api/find?collection=${collection.name}&id=${id}`)).data;
}

export function getFieldName(field: any) {
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

export async function extractData(fieldsData: any) {
	// exracts data from fieldsData because FieldsData is async
	let temp = {};
	for (let key in fieldsData) {
		temp[key] = await fieldsData[key]();
	}
	return temp;
}

export async function validate(auth: Auth, sessionID: string | null) {
	if (!sessionID) {
		return { user: {} as User, status: 404 };
	}
	const resp = await auth.validateSessionUser(sessionID).catch(() => null);
	if (!resp) return { user: {} as User, status: 404 };
	return { user: resp.user as User, status: 200 };
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
