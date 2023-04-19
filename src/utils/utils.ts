import fs from 'fs';
import schemas, { collection } from '../collections';
import { Blob } from 'buffer';
import type { Schema } from '@src/collections/types';
import axios from 'axios';
import { get } from 'svelte/store';
import { entryValue, mode } from '@src/stores/store';
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

export function saveFiles(data: FormData, collection: string) {
	let files: any = {};
	let _files: Array<any> = [];
	let schema = schemas.find((schema) => schema.name === collection);
	for (let [fieldname, fieldData] of data.entries()) {
		if (fieldData instanceof Blob) {
			_files.push({ blob: fieldData, fieldname });
		}
	}

	for (let file of _files) {
		let { blob, fieldname } = file;

		files[fieldname as keyof typeof files] = { name: blob.name, size: blob.size, type: blob.type, lastModified: blob.lastModified };
		let path = _findFieldByTitle(schema, fieldname).path;

		if (!fs.existsSync(path)) fs.mkdirSync(path, { recursive: true });
		(blob as Blob).arrayBuffer().then((arrayBuffer) => {
			fs.writeFileSync(path + '/' + blob.name, Buffer.from(arrayBuffer));
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
	let _query = JSON.stringify(query);
	return (await axios.get(`/api/find?collection=${collection.name}&query=${_query}`)).data;
}

export function getFieldName(field: any) {
	return (field?.db_fieldName || field?.label) as string;
}
export async function saveFormData(data) {
	let $mode = get(mode);
	let $collection = get(collection);
	let $entryValue = get(entryValue);
	let formData = data instanceof FormData ? data : await col2formData(data);
	if (!formData) return;
	switch ($mode) {
		case 'create':
			await axios.post(`/api/${$collection.name}`, formData, config);
			break;
		case 'edit':
			formData.append('_id', $entryValue._id);
			await axios.patch(`/api/${$collection.name}`, formData, config);
			break;
	}
}
