import type { Schema } from '@src/collections/types';
import { getFieldName } from './fields';
import sqlite3 from 'sqlite3';
import mongoose from 'mongoose';
import widgets from '@src/components/widgets';
import { SIZES } from './files';
const db = new sqlite3.Database('./db.db');

let _storage_images = {
	id: '_storage_images',
	columns: {},
	fields: [
		{
			label: 'hash',
			dataType: 'string'
		},
		{
			label: 'folder',
			dataType: 'string'
		},
		{
			label: 'used_by',
			dataType: 'json'
		},
		...Object.keys(SIZES).map((key) => ({
			label: key,
			dataType: {
				name: 'string',
				url: 'string',
				size: 'number',
				type: 'string',
				lastModified: 'number',
				width: 'number',
				height: 'number'
			}
		}))
	]
};

export class Adapter {
	collections: { [key: string]: Schema & { columns: { [key: string]: string } } };
	constructor(collections: { [key: string]: Schema & { columns?: { [key: string]: string } } }) {
		for (let c in collections) {
			collections[c].columns = { _links: 'json', _is_link: 'boolean', status: 'string' };
		}
		this.collections = { ...collections, _storage_images: _storage_images as any };
	}
	transformType = {
		string: 'TEXT',
		ObjectId: 'TEXT',
		boolean: 'BOOLEAN',
		number: 'NUMBER',
		date: 'TEXT',
		json: 'TEXT'
	};
	async setup() {
		let sql = '';
		for (let key in this.collections) {
			const collection = this.collections[key];
			let columns = this.transformColumns(collection.columns);

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
			_id TEXT PRIMARY KEY${_columns.length > 0 ? ',\n' + _columns : ''}
			);
		`;
		}
		db.exec(sql);
	}

	async insert(collectionPath: string, data): Promise<string> {
		let id = data?._id?.toString() || new mongoose.Types.ObjectId().toString();
		let collection = this.collections[collectionPath];
		const fieldNames = collection.fields.map((field) => getFieldName(field));
		let fieldsData: any[][] = [];

		for (let fieldName of fieldNames) {
			fieldsData = [...fieldsData, ...Object.entries(flattenData(data[fieldName], fieldName))];
		}
		let columns = Object.entries(collection.columns).filter(([key]) => data[key] !== undefined);
		const placeholders = ', ?'.repeat(fieldsData.length + columns.length);
		const sql = `
        INSERT INTO "${collection.id}" (_id, ${columns.map((c) => c[0]).join(', ')}, ${fieldsData.map((f) => `"${f[0]}"`).join(', ')})
        VALUES (? ${placeholders});
    `.replace(/,\s+,/g, ', ');
		let params: any[] = [];
		params.push(id);
		for (let [key, type] of columns) {
			params.push(type != 'json' ? data[key] : JSON.stringify(data[key]));
		}

		for (let [_, value] of fieldsData) {
			params.push(value);
		}
		return await new Promise<string>((resolve, reject) => {
			db.run(sql, params, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(id);
				}
			});
		});
	}

	update(collectionPath: string, data) {
		let collection = this.collections[collectionPath];
		const fieldNames = collection.fields.map((field) => getFieldName(field));
		let fieldsData: any[][] = [];

		for (let fieldName of fieldNames) {
			fieldsData = [...fieldsData, ...Object.entries(flattenData(data[fieldName], fieldName))];
		}
		let columns = Object.entries(collection.columns).filter(([key]) => data[key] !== undefined);
		const setClause = [
			...columns.map(([key]) => `"${key}" = ?`),
			...fieldsData.map(([key]) => `"${key}" = ?`)
		].join(', ');
		const sql = `
		        UPDATE "${collection.id}"
		        SET  ${setClause}
		        WHERE _id = ?;
		    `;
		let params: any[] = [];
		for (let [key, type] of columns) {
			params.push(type != 'json' ? data[key] : JSON.stringify(data[key]));
		}
		for (let [_, value] of fieldsData) {
			params.push(value);
		}
		params.push(data._id.toString());
		db.run(sql, params);
	}

	async getOne(collectionPath: string, modifiers: ReturnType<modifiers>[]) {
		let collection = this.collections[collectionPath];
		let sql = get(collection, modifiers, this.collections) + ' LIMIT 1';
		const result = await new Promise<any>((resolve, reject) => {
			db.get(sql, (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(row);
				}
			});
		});
		if ('_links' in collection.columns) {
			result._links = JSON.parse(result._links);
		}

		return unflattenData(result);
	}

	async getAll(collectionPath: string, modifiers: any[]) {
		let collection = this.collections[collectionPath];
		let sql = get(collection, modifiers, this.collections);
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
			if ('_links' in collection.columns) {
				row._links = JSON.parse(row._links);
			}
			return unflattenData(row);
		});
	}
	mediaExists(hash: string): Promise<boolean> {
		return new Promise((resolve, reject) => {
			db.get(`SELECT * FROM _storage_images WHERE hash = ? LIMIT 1`, [hash], (err, row) => {
				if (err) {
					reject(err);
				} else {
					resolve(!!row);
				}
			});
		});
	}
	transformColumns(columns) {
		return Object.keys(columns).reduce((acc, key) => {
			acc[key] = this.transformType[columns[key]];
			return acc;
		}, {});
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

function get(
	collection: Schema & {
		columns: {
			[key: string]: string;
		};
	},
	modifiers: ReturnType<modifiers>[],
	collections: { [key: string]: Schema & { columns: { [key: string]: string } } }
) {
	let lookups = modifiers.filter((m) => m.lookup) as Required<ReturnType<modifiers>>[];
	let matches = modifiers.filter((m) => m.match) as Required<ReturnType<modifiers>>[];
	let sort = modifiers.filter((m) => m.sort)[0] as Required<ReturnType<modifiers>>;
	let selects = collection.fields
		.filter((f) => !lookups.find((m) => m.lookup.as === getFieldName(f)))
		.map((f: any) =>
			Object.keys(flattenData(f.dataType, getFieldName(f))).map((f) => `main."${f}"`)
		)
		.concat(Object.keys(collection.columns).map((c) => `main."${c}"`))

		.join(', ');
	if (selects) selects += ', ';
	let sql = `SELECT ${selects} main._id `;
	for (let lookup of lookups) {
		let relative_collection = Object.values(collections).find(
			(c) => c.id === lookup.lookup.from
		) as Schema;
		let relative_fields = relative_collection.fields.map((f: any) => {
			return Object.keys(flattenData(f.dataType, `${getFieldName(f)}`)).map(
				(f) => `${lookup.lookup.localField}."${f}" as "${lookup.lookup.localField}->${f}"`
			);
		}) as any[];
		sql += `,${relative_fields.join(',')}`;
	}
	sql += ` FROM "${collection.id}" main`;
	for (let lookup of lookups) {
		sql += ` LEFT JOIN "${lookup.lookup.from}" ${lookup.lookup.localField}  ON ${lookup.lookup.localField}.${lookup.lookup.foreignField} = main.${lookup.lookup.localField}`;
	}
	let is_where = false;
	for (let i = 0; i < matches.length; i++) {
		let match = matches[i];
		if (!is_where) sql += ' WHERE ';
		let key = Object.keys(match.match)[0];
		is_where = true;
		if (match.match[key].strict) sql += ` "${key}" = "${match.match[key].text}"`;
		else sql += ` "${key}" LIKE "%${match.match[key].text}%"`;
		if (i < matches.length - 1) sql += ' AND ';
	}
	if (sort) {
		let key = Object.keys(sort.sort)[0];
		let order = sort.sort[key];
		if (order != 0) sql += ` ORDER BY "${key}" ${order < 0 ? 'ASC' : 'DESC'}`;
	}
	return sql;
}
