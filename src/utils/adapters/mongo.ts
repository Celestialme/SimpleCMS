import type { Schema } from '@src/collections/types';
import { getFieldName } from '../fields';
import mongoose from 'mongoose';
import privateEnv from '@root/config/private';
import { PATH, type MEDIA } from './types';
import type EntryList from '@src/components/EntryList.svelte';
import { collections } from '@src/stores/store.svelte';
export class Adapter {
	private collections: { [key: string]: Schema };
	private linkedCollections: {
		[key: string]: Schema & { originalCollections: Schema[] };
	};
	constructor(collections: { [key: string]: Schema }) {
		this.linkedCollections = Array.from(
			Object.values(collections).reduce((acc, c) => {
				c.links?.forEach((l) => acc.add(l));
				return acc;
			}, new Set())
		).reduce((acc: { [key: string]: any }, c) => {
			acc[collections[c as string].id + '_links'] = {
				id: collections[c as string].id + '_links',
				originalCollections: Object.values(collections).filter((collection) =>
					collection.links?.includes(c as any)
				),
				fields: []
			};

			return acc;
		}, {});

		this.collections = {
			...collections,

			_storage_images: { id: '_storage_images', fields: [] },
			_tokens: { id: '_tokens', fields: [] },
			_users: { id: '_users', fields: [] },
			_sessions: { id: '_sessions', fields: [] },
			...this.linkedCollections
		};
	}
	async setup() {
		mongoose
			.connect(privateEnv.DB_HOST, {
				authSource: 'admin',
				user: privateEnv.DB_USER,
				pass: privateEnv.DB_PASSWORD,
				dbName: privateEnv.DB_NAME
			})
			.then(() => console.log('---------------------connected-----------------------'));
		mongoose.set('strictQuery', false);
		const schema_object = new mongoose.Schema(
			{},
			{
				typeKey: '$type',
				strict: false
			}
		);
		for (let key in this.collections) {
			const collection = this.collections[key];
			mongoose.models[collection.id]
				? mongoose.model(collection.id)
				: mongoose.model(collection.id, schema_object);
		}
	}

	async get(collectionPath: string, modifiers: ReturnType<modifiers>[]) {
		let collection = this.collections[collectionPath];
		let linkedCollection = this.linkedCollections[`${collection.id}_links`];
		let collectionModel = mongoose.models[collection.id];
		let lookups = modifiers.filter((m) => m.lookup).map((m) => ({ ...m.lookup })) as Required<
			ReturnType<modifiers>
		>['lookup'][];
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
		let _modifiers = [] as any[];
		if (linkedCollection) {
			console.log(linkedCollection);
			_modifiers.push({
				$unionWith: {
					coll: linkedCollection.id,
					pipeline: [
						...linkedCollection.originalCollections.map((originalCollection) => ({
							$lookup: {
								from: originalCollection.id,
								localField: '_link_id',
								foreignField: '_id',
								let: {
									linked_collection: '$_linked_collection'
								},
								pipeline: [
									{
										$match: {
											$expr: {
												$eq: [originalCollection.id, '$$linked_collection']
											}
										}
									},
									{
										$addFields: {
											_is_link: true,
											_linked_collection: originalCollection.path
										}
									}
								],
								as: 'related'
							}
						})),
						{ $unwind: '$related' },
						{
							$replaceRoot: { newRoot: '$related' }
						}
					]
				}
			});
		}
		for (let lookup in lookups) {
			_modifiers.push({
				$lookup: {
					from: lookups[lookup].from,
					localField: lookups[lookup].localField,
					foreignField: lookups[lookup].foreignField,
					as: lookups[lookup].as
				}
			});
			_modifiers.push({
				$unwind: `$${lookups[lookup].localField}`
			});
		}
		for (let m of matches) {
			for (let match of Object.keys(m)) {
				let value = m[match].id ? new mongoose.Types.ObjectId(m[match].value) : m[match].value;
				if (m[match].strict) {
					_modifiers.push({
						$match: {
							[match.replaceAll('__', '.')]: value
						}
					});
				} else {
					_modifiers.push({
						$match: {
							[match.replaceAll('__', '.')]: {
								$regex: value,
								$options: 'i'
							}
						}
					});
				}
			}
		}

		for (let key in sort) {
			_modifiers.push({ $sort: sort[key] });
		}
		let result = (
			await collectionModel.aggregate([
				{
					$facet: {
						rows: [..._modifiers, { $skip: skip || 0 }, ...(limit ? [{ $limit: limit }] : [])],
						total: [..._modifiers, { $count: 'total' }]
					}
				}
			])
		)[0];

		return {
			rows: result.rows,
			total: result.total[0]?.total ?? 0
		};
	}

	async insert(collectionPath: string, data): Promise<string> {
		let _data = { ...data, _createdAt: Date.now(), _updatedAt: Date.now() };
		_data._id = _data?._id
			? new mongoose.Types.ObjectId(_data?._id as string)
			: new mongoose.Types.ObjectId();
		let collection = this.collections[collectionPath];
		let collectionModel = mongoose.models[collection.id];
		await collectionModel.insertMany(_data);
		return _data._id.toString();
	}
	async updateMany(collectionPath: string, data) {
		let _data = { ...data, _updatedAt: Date.now() };
		let collection = this.collections[collectionPath];
		let collectionModel = mongoose.models[collection.id];
		await collectionModel.updateMany({ _id: { $in: _data._ids } }, _data);
	}
	async deleteById(collectionPath: string, ids: string[]) {
		let collection = this.collections[collectionPath];
		let collectionModel = mongoose.models[collection.id];
		await collectionModel.deleteMany({ _id: { $in: ids } });
	}
	async deleteMany(collectionPath: string, modifiers: ReturnType<modifiers>['match'][]) {
		let matches = modifiers.filter((m) => m!.match).map((m) => m!.match);
		let collection = this.collections[collectionPath];
		let collectionModel = mongoose.models[collection.id];
		let _match = {};
		for (let i = 0; i < matches.length; i++) {
			let match = matches[i];
			let keys = Object.keys(match);
			for (let i = 0; i < keys.length; i++) {
				let key = keys[i];
				if (match[key].strict) {
					_match[key] = match[key].value;
				} else {
					_match[key] = { $regex: match[key].value, $options: 'i' };
				}
			}
		}

		await collectionModel.deleteMany(_match);
	}
	countFolders(collectionPath: string) {
		let collection = this.collections[collectionPath];
		let collectionModel = mongoose.models[collection.id];
		return collectionModel.aggregate([{ $group: { _id: '$folder', count: { $sum: 1 } } }]);
	}
	async getMedia({
		type,
		search,
		folder,
		limit,
		page
	}: {
		type: MEDIA;
		search: string;
		folder: string;
		limit: number;
		page: number;
	}) {
		let collection = this.collections[PATH[type]];
		let collectionModel = mongoose.models[collection.id];
		let re = new RegExp(RegExp.escape(search), 'i');
		let _collections = {} as typeof this.collections;
		for (let key in collections()) {
			_collections[key] = this.collections[key];
		}
		let lookups = Object.keys(_collections).map((key) => ({
			$lookup: {
				from: _collections[key].id,
				let: { id: '$_id' },
				pipeline: [
					{
						$match: {
							$expr: { $in: ['$$id', '$' + PATH[type]] }
						}
					},
					{ $count: 'total' }
				],
				as: `${_collections[key].id}_count`
			}
		}));
		let search_aggregation = {
			$match: {
				'original.name': { $regex: re },
				folder: folder
			}
		};

		let files = await collectionModel.aggregate([
			{
				$facet: {
					images: [
						...lookups,
						{
							$addFields: {
								used_by: {
									$sum: Object.values(_collections).map(({ id }) => {
										return { $arrayElemAt: [`$${id}_count.total`, 0] };
									})
								}
							}
						},
						{
							$project: Object.values(_collections).reduce((acc, val) => {
								acc[`${val.id}_count`] = 0;
								return acc;
							}, {})
						},
						search_aggregation,
						{ $skip: (page - 1) * limit },
						{ $limit: limit }
					],
					count: [search_aggregation, { $count: 'total' }]
				}
			}
		]);

		return { entryList: files[0].images, total: files[0].count[0].total };
	}
}
