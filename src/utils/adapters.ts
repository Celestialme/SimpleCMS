import type { Schema } from '@src/collections/types';
import { getFieldName } from './fields';
import sqlite3 from 'sqlite3';
import mongoose from 'mongoose';
import { SIZES } from './files';
import widgets from '@src/components/widgets';
import { collections } from '@src/stores/store.svelte';
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
const transformType = {
	string: 'TEXT',
	ObjectId: 'TEXT',
	boolean: 'BOOLEAN',
	number: 'NUMBER',
	date: 'TEXT',
	json: 'TEXT'
};
export class Adapter {
	private collections: { [key: string]: Schema & { columns: { [key: string]: string } } };
	private linkedCollections: {
		[key: string]: Schema & { columns: { [key: string]: string }; originalCollections: string[] };
	};
	constructor(collections: { [key: string]: Schema & { columns?: { [key: string]: string } } }) {
		for (let c in collections) {
			collections[c].columns = {
				_links: 'json',
				status: 'string',
				_storage_images: 'json'
			};
			for (let field of collections[c].fields) {
				if ('dataType' in field) {
					let dataType = flattenDataType(field.dataType, getFieldName(field), {});
					collections[c].columns = { ...collections[c].columns, ...dataType };
				}
			}
		}
		_storage_images.columns = _storage_images.fields.reduce(
			(acc, f) => ({ ...acc, ...flattenDataType(f.dataType, getFieldName(f), {}) }),
			{}
		);

		this.linkedCollections = Array.from(
			Object.values(collections).reduce((acc, c) => {
				c.links?.forEach((l) => acc.add(l));
				return acc;
			}, new Set())
		).reduce((acc: { [key: string]: any }, c) => {
			acc[collections[c as string].id + '_link'] = {
				id: collections[c as string].id + '_link',
				originalCollections: Object.values(collections)
					.filter((collection) => collection.links?.includes(c as any))
					.map((c) => c.id),
				fields: [],
				columns: {
					_link_id: 'ObjectId',
					_linked_collection: 'string'
				}
			};

			return acc;
		}, {});

		this.collections = {
			...collections,
			_storage_images: _storage_images as any,
			...this.linkedCollections
		};
	}

	async setup() {
		let sql = '';
		for (let key in this.collections) {
			const collection = this.collections[key];
			let columns = transformColumns(collection.columns);

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
		for (let fieldName of fieldNames) {
			let flat_data = flattenData(data[fieldName], fieldName);
			delete data[fieldName];
			data = { ...data, ...flat_data };
		}
		let columns = Object.entries(collection.columns).filter(([key]) => data[key] !== undefined);
		const placeholders = ', ?'.repeat(columns.length);
		const sql = `
        INSERT INTO "${collection.id}" (_id, ${columns.map(([key]) => `"${key}"`).join(', ')})
        VALUES (? ${placeholders});
    `.replace(/,\s+,/g, ', ');
		let params: any[] = [];
		params.push(id);

		for (let [key, type] of columns) {
			params.push(sanitizeData({ data: data[key], type, flow: 'in' }));
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

	async updateMany(collectionPath: string, data) {
		let collection = this.collections[collectionPath];
		const fieldNames = collection.fields.map((field) => getFieldName(field));

		for (let fieldName of fieldNames) {
			let flat_data = flattenData(data[fieldName], fieldName);
			delete data[fieldName];
			data = { ...data, ...flat_data };
		}
		let columns = Object.entries(collection.columns).filter(([key]) => data[key] !== undefined);
		const setClause = columns.map(([key]) => `"${key}" = ?`).join(', ');
		const sql = `
		        UPDATE "${collection.id}"
		        SET  ${setClause}
		        WHERE _id IN (${data._ids.map(() => '?').join(', ')}) ;
		    `;
		let params: any[] = [];
		for (let [key, type] of columns) {
			params.push(sanitizeData({ data: data[key], type, flow: 'in' }));
		}

		params.push(...data._ids.map((id) => id.toString()));
		console.log(setClause);
		console.log(params);
		db.run(sql, params);
	}

	async get(collectionPath: string, modifiers: ReturnType<modifiers>[]) {
		let collection = this.collections[collectionPath];
		let lookups = modifiers
			.filter((m) => m.lookup)
			.map((m) => ({ ...m.lookup, prefix: 'main.' })) as (Required<
			ReturnType<modifiers>
		>['lookup'] & { prefix: string })[];
		let matches = modifiers.filter((m) => m.match).map((m) => m.match) as Required<
			ReturnType<modifiers>
		>['match'][];
		let sort = modifiers.filter((m) => 'sort' in m)[0]?.sort as Required<
			ReturnType<modifiers>['sort']
		>;
		let skip = modifiers.filter((m) => 'skip' in m)[0]?.skip as Required<
			ReturnType<modifiers>['skip']
		>;
		let limit = modifiers.filter((m) => 'limit' in m)[0]?.limit as Required<
			ReturnType<modifiers>['limit']
		>;

		let selects = Object.keys(collection.columns)
			.filter((f) => !lookups.find((m) => m.as === f))
			.map((c) => `main."${c}"`)
			.join(', ');
		let sql = `SELECT * FROM (SELECT main._id,false as _is_link, `;
		let columns = { ...collection.columns };
		for (let lookup of lookups) {
			let relative_collection = Object.values(this.collections).find(
				(c) => c.id === lookup.from
			) as Schema & { columns: { [key: string]: string } };

			for (let field of relative_collection?.fields) {
				let widget = widgets[field?.widgetName];
				if (widget && 'modifiers' in widget) {
					let modifiers = await widget.modifiers({
						field
					});
					if (modifiers?.lookup) {
						let _lookup = modifiers.lookup as ReturnType<modifiers>['lookup'] & { prefix: string };
						_lookup.prefix = '';
						_lookup.localField = `${lookup.localField}__${_lookup.as}`;
						_lookup.as = `${lookup.as}__${_lookup.as}`;
						lookups.push(_lookup);
					}
				}
			}
			let relative_fields = Object.keys(relative_collection?.columns).map(
				(c) => `${lookup.localField}.${c} as ${lookup.localField}__${c}`
			);
			let relative_columns = relative_collection?.columns;
			for (let key in relative_columns) {
				columns[`${lookup.as}__${key}`] = relative_columns[key];
			}
			delete columns[lookup.as];
			selects += `,${lookup.localField}._id as ${lookup.localField}___id,${relative_fields.join(',')}`;
		}

		sql += `${selects} FROM "${collection.id}" main`;
		let joins = '';
		for (let lookup of lookups) {
			joins += ` LEFT JOIN "${lookup.from}" ${lookup.localField} ON ${lookup.localField}.${lookup.foreignField} = ${lookup.prefix}${lookup.localField}`;
		}
		sql += joins;
		let linkedCollection = this.linkedCollections[`${collection.id}_link`];

		if (linkedCollection) {
			for (let Lcollection of linkedCollection.originalCollections) {
				sql += `
			UNION
			SELECT main._id,true as _is_link, ${selects}
			FROM
				"${collection.id}_link" link
				JOIN
				"${Lcollection}" main ON link._link_id = main._id AND link._linked_collection = '${Lcollection}'`;
				sql += `${joins}`;
			}
		}

		sql += ') as main WHERE 1=1';
		for (let i = 0; i < matches.length; i++) {
			let match = matches[i];

			let keys = Object.keys(match);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				let _key = !key.includes('__') ? `main.${key}` : key;
				if (match[key].strict) sql += ` AND ${_key} = "${match[key].value}"`;
				else sql += ` AND ${_key} LIKE "%${match[key].value}%"`;
			}
		}

		if (sort) {
			let key = Object.keys(sort)[0];
			let order = sort[key];
			if (order != 0) sql += ` ORDER BY ${key} ${order < 0 ? 'ASC' : 'DESC'}`;
		}
		let count_sql = sql.replaceAll('SELECT *', 'SELECT COUNT(*) as count');
		if (limit) sql += ` LIMIT ${limit}`;

		if (skip) sql += ` OFFSET ${skip}`;

		const result = await new Promise<any[]>((resolve, reject) => {
			db.all(`${sql}`, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
		const total = await new Promise<any>((resolve, reject) => {
			db.get(`${count_sql}`, (err, row: { count: number }) => {
				if (err) {
					reject(err);
				} else {
					resolve(row.count);
				}
			});
		});
		return {
			rows: result.map((row) => {
				for (let key in columns) {
					row[key] = sanitizeData({ data: row[key], type: columns[key], flow: 'out' });
				}
				return unflattenData(row);
			}) as any[],
			total
		};
	}

	async getMedia({
		type,
		search,
		folder,
		limit,
		page
	}: {
		type: 'IMAGE';
		search: string;
		folder: string;
		limit: number;
		page: number;
	}) {
		let path = {
			IMAGE: '_storage_images'
		};
		let _collections = {};
		for (let key in collections()) {
			_collections[key] = this.collections[key];
		}
		let collection = this.collections[path[type]];
		let selects = Object.keys(_collections).map(
			(key) => `"${_collections[key].id}"._storage_images`
		);
		let sql = `SELECT main.*,COUNT(*) as count, COALESCE(${selects.join(', ')}) as used_by FROM  ${collection.id} main `;
		for (let key in _collections) {
			sql += `LEFT JOIN "${_collections[key].id}" ON main._id IN (
    		SELECT value
  		  	FROM json_each("${_collections[key].id}"._storage_images)
			)\n`;
		}

		sql += `WHERE main.folder = '${folder}'`;
		if (search) {
			sql += ` AND main."original__name" LIKE '%${search}%' `;
		}
		sql += ' GROUP BY main._id ';
		sql += ` LIMIT ${limit} OFFSET ${limit * (page - 1)}`;
		let result = await new Promise<any[]>((resolve, reject) => {
			db.all(sql, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		});
		let count_sql = `SELECT COUNT(*) as count FROM  ${collection.id} main WHERE folder = '${folder}'`;
		if (search) {
			count_sql += ` AND main."original__name" LIKE '%${search}%' `;
		}
		let total = await new Promise<number>((resolve, reject) => {
			db.get(count_sql, (err, row: { count: number }) => {
				if (err) {
					reject(err);
				} else {
					resolve(row.count);
				}
			});
		});
		return {
			entryList: result.map((row) => {
				row.used_by = row.used_by ? row.count : 0;
				return unflattenData(row);
			}) as any[],
			total
		};
	}
	countFolders(collectionPath: string) {
		let collection = this.collections[collectionPath];
		let sql = `SELECT folder AS _id,  COUNT(*) AS count FROM  ${collection.id} GROUP BY folder;`;
		return new Promise<{ _id: string; count: number }[]>((resolve, reject) => {
			db.all(sql, (err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows as any);
				}
			});
		});
	}
	deleteMany(collectionPath: string, ids: string[]) {
		let collection = this.collections[collectionPath];
		let sql = `DELETE FROM "${collection.id}" WHERE _id IN (${ids.map((_) => `?`).join(', ')})`;
		return new Promise<void>((resolve, reject) => {
			db.run(sql, ids, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}
}

function flattenDataType(type: Object, prefix = '', transformType) {
	let result = {};

	if (typeof type == 'string') {
		return { [prefix]: transformType[type] || type };
	}

	for (const key in type) {
		if (typeof type[key] === 'object' && !Array.isArray(type[key])) {
			// Recursively flatten the nested object
			Object.assign(result, flattenDataType(type[key], `${prefix}__${key}`, transformType));
		} else {
			// Add the flattened key-value pair to the result
			result[`${prefix}__${key}`] = transformType[type[key]] || type[key];
		}
	}

	return result;
}

function flattenData(type: any, prefix = '') {
	let result = {};
	if (typeof type == 'string' || type instanceof mongoose.Types.ObjectId) {
		return { [prefix]: type.toString() };
	} else if (Array.isArray(type)) {
		return { [prefix]: type };
	}
	for (const key in type) {
		if (typeof type[key] === 'object' && !Array.isArray(type[key])) {
			// Recursively flatten the nested object
			Object.assign(result, flattenData(type[key], `${prefix}__${key}`));
		} else {
			// Add the flattened key-value pair to the result
			result[`${prefix}__${key}`] = type[key];
		}
	}

	return result;
}
function unflattenData(flatObj) {
	if (!flatObj) return null;

	let result = {};
	for (const flatKey in flatObj) {
		const keys = flatKey.split('__'); // Split the flat key into parts
		keys.reduce((acc, key, index) => {
			// If it's the last key, assign the value
			if (typeof acc[key] != 'object') acc[key] = {};
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

function transformColumns(columns) {
	return Object.keys(columns).reduce((acc, key) => {
		acc[key] = transformType[columns[key]];
		return acc;
	}, {});
}

function sanitizeData({ data, type, flow }: { data: any; type: string; flow: 'in' | 'out' }) {
	if (type == 'json' && flow == 'in') return JSON.stringify(data);
	else if (type == 'json' && flow == 'out') return JSON.parse(data);
	else if (type == 'ObjectId') return data.toString();
	return data;
}
