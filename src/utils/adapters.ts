import type { Schema } from '@src/collections/types';
import { getFieldName } from './fields';
import sqlite3 from 'sqlite3';
import mongoose from 'mongoose';
import widgets from '@src/components/widgets';
const db = new sqlite3.Database('./db.db');
// export function adapter({ collection, modifiers }: { collection: Schema; modifiers: any[] }) {
// 	let sql = 'SELECT ';
// 	let lookups = modifiers.filter((m) => m.$lookup);

// 	for (let i = 0; i < collection.fields.length; i++) {
// 		const is_last = i === collection.fields.length - 1;
// 		const field = collection.fields[i];
// 		const fieldName = getFieldName(field);
// 		const lookup = lookups.find((m) => m.$lookup.localField === fieldName)?.$lookup;

// 		if (lookup) {
// 			sql += `${lookup.from}.${lookup.foreignField} AS ${lookup.as}`;
// 		} else {
// 			sql += `${collection.id}.${fieldName}`;
// 		}

// 		if (!is_last) sql += ', ';
// 	}

// 	sql += ` FROM ${collection.id}`;

// 	if (lookups.length > 0) {
// 		for (const lookup of lookups) {
// 			sql += ` LEFT JOIN ${lookup.$lookup.from} ON ${collection.id}.${lookup.$lookup.localField} = ${lookup.$lookup.from}.${lookup.$lookup.foreignField}`;
// 		}
// 	}

// 	// Add additional conditions (WHERE clauses, if necessary)
// 	sql += ' WHERE 1=1'; // Placeholder to append further conditions safely

// 	// Print the final SQL query for debugging
// 	console.log(sql);
// }

export class Adapter {
	collections: Schema[];
	constructor(collections) {
		this.collections = collections;
	}
	transformType = {
		string: 'TEXT',
		ObjectId: 'TEXT'
	};
	async setup() {
		let sql = '';
		for (let key in this.collections) {
			const collection = this.collections[key];
			let columns = {};

			for (let field of collection.fields) {
				if ('dataType' in field) {
					let dataType = flattenDataType(field.dataType, getFieldName(field), this.transformType);
					columns = { ...columns, ...dataType };
				}
			}
			let _columns = Object.keys(columns)
				.map((key) => `"${key}" ${columns[key]}`)
				.join(',\n');
			sql += `
			CREATE TABLE IF NOT EXISTS "${collection.id}" (
			_id TEXT PRIMARY KEY,
		    _links TEXT,
		    _is_link BOOLEAN,
		    status TEXT${_columns.length > 0 ? ',\n' + _columns : ''}
			);
		`;
		}
		console.log(sql);
		db.exec(sql);
	}

	insert(collection: Schema, data) {
		const fieldNames = collection.fields.map((field) => getFieldName(field));
		let fieldsData: any[][] = [];

		for (let fieldName of fieldNames) {
			fieldsData = [...fieldsData, ...Object.entries(flattenData(data[fieldName], fieldName))];
		}
		const placeholders = ', ?'.repeat(fieldsData.length);
		const sql = `
        INSERT INTO "${collection.id}" (_id, _links, _is_link, status, ${fieldsData.map((f) => `"${f[0]}"`).join(', ')})
        VALUES (?, ?, ?, ? ${placeholders});
    `;
		let params: any[] = [];
		params.push(data._id.toString());
		params.push(JSON.stringify(data._links));
		params.push(data._is_link);
		params.push(data.status);
		for (let [_, value] of fieldsData) {
			params.push(value);
		}

		db.run(sql, params);
	}

	update(collection: Schema, data) {
		const fieldNames = collection.fields.map((field) => getFieldName(field));
		let fieldsData: any[][] = [];

		for (let fieldName of fieldNames) {
			fieldsData = [...fieldsData, ...Object.entries(flattenData(data[fieldName], fieldName))];
		}
		const setClause = [`_links = ?`, ...fieldsData.map(([key, value]) => `"${key}" = ?`)].join(
			', '
		);
		const sql = `
		        UPDATE "${collection.id}"
		        SET  ${setClause}
		        WHERE _id = ?;
		    `;
		let params: any[] = [];
		params.push(JSON.stringify(data._links));
		for (let [_, value] of fieldsData) {
			params.push(value);
		}
		params.push(data._id.toString());
		db.run(sql, params);
	}

	async getAll(collection: Schema, modifiers: any[]) {
		let lookups = modifiers.filter((m) => m.$lookup);

		let selects = collection.fields
			.filter((f) => !lookups.find((m) => m.$lookup.as === getFieldName(f)))
			.map((f: any) =>
				Object.keys(flattenData(f.dataType, getFieldName(f))).map((f) => `main."${f}"`)
			)

			.join(', ');
		if (selects) selects += ', ';
		let sql = `SELECT ${selects} main._id,main._links,main._is_link, main.status `;
		for (let lookup of lookups) {
			let relative_collection = Object.values(this.collections).find(
				(c) => c.id === lookup.$lookup.from
			) as Schema;
			let relative_fields = relative_collection.fields.map((f: any) => {
				return Object.keys(flattenData(f.dataType, `${getFieldName(f)}`)).map(
					(f) => `${lookup.$lookup.localField}."${f}" as "${lookup.$lookup.localField}->${f}"`
				);
			}) as any[];
			sql += `,${relative_fields.join(',')}`;
		}
		sql += ` FROM "${collection.id}" main`;
		for (let lookup of lookups) {
			sql += ` LEFT JOIN "${lookup.$lookup.from}" ${lookup.$lookup.localField}  ON ${lookup.$lookup.localField}.${lookup.$lookup.foreignField} = main.${lookup.$lookup.localField}`;
		}
		console.log(sql);
		const result = await new Promise<any[]>((resolve, reject) => {
			db.all(sql, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
		return result.map((row) => {
			row._links = JSON.parse(row._links);

			return unflattenData(row);
		});
	}
}

function flattenDataType(type: Object, prefix = '', transformType) {
	let result = {};

	if (typeof type == 'string') {
		return { [prefix]: transformType[type] };
	}

	for (const key in type) {
		if (typeof type[key] === 'object' && !Array.isArray(type[key])) {
			// Recursively flatten the nested object
			Object.assign(result, flattenDataType(type[key], `${prefix}->${key}`, transformType));
		} else {
			// Add the flattened key-value pair to the result
			result[`${prefix}->${key}`] = transformType[type[key]];
		}
	}

	return result;
}

function flattenData(type: any, prefix = '') {
	let result = {};
	if (typeof type == 'string' || type instanceof mongoose.Types.ObjectId) {
		return { [prefix]: type.toString() };
	}
	for (const key in type) {
		if (typeof type[key] === 'object' && !Array.isArray(type[key])) {
			// Recursively flatten the nested object
			Object.assign(result, flattenData(type[key], `${prefix}->${key}`));
		} else {
			// Add the flattened key-value pair to the result
			result[`${prefix}->${key}`] = type[key];
		}
	}

	return result;
}
function unflattenData(flatObj) {
	let result = {};
	for (const flatKey in flatObj) {
		const keys = flatKey.split('->'); // Split the flat key into parts
		keys.reduce((acc, key, index) => {
			// If it's the last key, assign the value
			if (index === keys.length - 1) {
				acc[key] = flatObj[flatKey];
			} else {
				// Ensure nested object exists
				acc[key] = acc[key] || {};
			}
			return acc[key];
		}, result);
	}
	return result;
}
