import type { Schema } from '@src/collections/types';
import { getFieldName } from './fields';
import sqlite3 from 'sqlite3';
import mongoose from 'mongoose';
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

	async setup() {
		let sql = '';
		for (let key in this.collections) {
			const collection = this.collections[key];
			sql += `CREATE TABLE IF NOT EXISTS "${collection.id}" (
            _id TEXT PRIMARY KEY,
            _links TEXT,
            _is_link BOOLEAN,
            status TEXT,
            `;
			for (let i = 0; i < collection.fields.length; i++) {
				const field = collection.fields[i];
				const fieldName = getFieldName(field);
				sql += `"${fieldName}" TEXT`;
				if (i < collection.fields.length - 1) {
					sql += ',';
				}
			}
			sql += ');\n';
		}
		db.exec(sql);
	}
	insert(collection: Schema, data) {
		const fieldNames = collection.fields.map((field) => getFieldName(field));
		const placeholders = ', ?'.repeat(fieldNames.length);
		const _data = {
			...data,
			_id: data._id.toString(),
			_links: JSON.stringify(data._links)
		};

		for (let fieldName of fieldNames) {
			if (_data[fieldName] instanceof mongoose.Types.ObjectId) {
				_data[fieldName] = _data[fieldName].toString();
			} else if (typeof _data[fieldName] == 'object') {
				_data[fieldName] = JSON.stringify(_data[fieldName]);
			}
		}

		const sql = `
        INSERT INTO "${collection.id}" (_id, _links, _is_link, status, ${fieldNames.join(', ')})
        VALUES (?, ?, ?, ? ${placeholders});
    `;
		let params: any[] = [];
		params.push(_data._id);
		params.push(_data._links);
		params.push(_data._is_link);
		params.push(_data.status);
		for (let fieldName of fieldNames) {
			params.push(_data[fieldName]);
		}
		db.run(sql, params);
	}

	update(collection: Schema, data) {
		const fieldNames = collection.fields.map((field) => getFieldName(field));
		const setClause = [
			`_id = ?`,
			`_links = ?`,
			...fieldNames.map((fieldName) => `${fieldName} = ?`)
		].join(', ');
		const _data = {
			...data,
			_id: data._id.toString(),
			_links: JSON.stringify(data._links)
		};
		for (let fieldName of fieldNames) {
			if (typeof data[fieldName] == 'object') {
				_data[fieldName] = JSON.stringify(_data[fieldName]);
			}
		}

		const sql = `
            UPDATE "${collection.id}"
            SET  ${setClause}
            WHERE _id = ?;
        `;
		let params: any[] = [];
		params.push(_data._id);
		params.push(_data._links);
		for (let fieldName of fieldNames) {
			params.push(_data[fieldName]);
		}
		params.push(_data._id);

		db.run(sql, params);
	}
	async getAll(collection: Schema) {
		const fieldNames = collection.fields.map((field) => getFieldName(field));
		const sql = `SELECT * FROM "${collection.id}";`;
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
			for (let fieldName of fieldNames) {
				try {
					row[fieldName] = JSON.parse(row[fieldName]);
				} catch (e) {}
			}
			return row;
		});
	}
	async relative(collection, modifiers: any[]) {
		let lookups = modifiers.filter((m) => m.$lookup);
		const fieldNames = collection.fields.map((field) => getFieldName(field));
		let selects = fieldNames
			.filter((f) => !lookups.find((m) => m.$lookup.as === f))
			.map((f) => `main.${f}`)
			.join(', ');
		selects ? (selects += ', ') : '';
		let sql = `SELECT  ${selects} main._id,main._links,main._is_link, main.status`;
		let index = 0;
		for (let lookup of lookups) {
			let relative_fields = Object.values(this.collections)
				.find((c) => c.id === lookup.$lookup.from)
				?.fields.map((f) => {
					index++;
					return `"${getFieldName(f)}":' || j${index}."${getFieldName(f)}"`;
				}) as any[];
			sql += `, '{ ${relative_fields.join('|| ')} || '}' as "${lookup.$lookup.as}"`;
		}
		sql += ` FROM "${collection.id}" main`;
		index = 0;
		for (let lookup of lookups) {
			index++;
			sql += ` LEFT JOIN "${lookup.$lookup.from}" j${index}  ON j${index}."${lookup.$lookup.foreignField}" = main."${lookup.$lookup.localField}"`;
		}
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
			for (let fieldName of fieldNames) {
				try {
					row[fieldName] = JSON.parse(row[fieldName]);
				} catch (e) {}
			}
			return row;
		});
	}
}
