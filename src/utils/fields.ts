import { createRandomID, deepCopy } from './utils';

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

export function getFieldName(field: any, sanitize = false) {
	if (sanitize) {
		return (field?.db_fieldName || field?.label)?.replaceAll(' ', '_');
	}
	return (field?.db_fieldName || field?.label) as string;
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

export async function extractData(fieldsData: any): Promise<{ [key: string]: any }> {
	// exracts data from fieldsData because FieldsData is async
	let temp = {};
	for (let key in fieldsData) {
		temp[key] = await fieldsData[key]();
	}
	return temp;
}
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
