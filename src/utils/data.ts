import axios from 'axios';
import { config, toFormData } from './utils';
import type { CollectionTypes, Schema } from '@src/collections/types';
import { mode, collection, entryData } from '@src/stores/store.svelte';
import { col2formData } from './fields';

export async function getData(query: {
	collectionName: keyof CollectionTypes;
	page?: number;
	limit?: number;
	contentLanguage?: string;
	filter?: { [key: string]: any };
	sort?: { [key: string]: any };
}) {
	let { filter, sort } = query;

	let q = toFormData({
		method: 'GET',
		...query,
		filter: JSON.stringify(filter),
		sort: JSON.stringify(sort)
	});
	return (await axios.post('/api/query', q).then((data) => data.data)) as {
		entryList: [any];
		pagesCount: number;
	};
}

export async function addData({
	data,
	collectionName
}: {
	data: FormData;
	collectionName: keyof CollectionTypes;
}) {
	data.append('collectionName', collectionName);
	data.append('method', 'POST');
	return await axios.post(`/api/query`, data, config).then((res) => res.data);
}

export async function updateData({
	data,
	collectionName
}: {
	data: FormData;
	collectionName: keyof CollectionTypes;
}) {
	data.append('collectionName', collectionName);
	data.append('method', 'PATCH');
	return await axios.post(`/api/query`, data, config).then((res) => res.data);
}

export async function deleteData({
	data,
	collectionName
}: {
	data: FormData;
	collectionName: keyof CollectionTypes;
}) {
	data.append('collectionName', collectionName);
	data.append('method', 'DELETE');
	return await axios.post(`/api/query`, data, config).then((res) => res.data);
}

export async function setStatus({
	data,
	collectionName
}: {
	data: FormData;
	collectionName: keyof CollectionTypes;
}) {
	data.append('collectionName', collectionName);
	data.append('method', 'SETSTATUS');
	return await axios.post(`/api/query`, data, config).then((res) => res.data);
}

export async function saveFormData({
	data,
	_collection,
	_mode,
	id
}: {
	data: any;
	_collection?: Schema;
	_mode?: 'edit' | 'create';
	id?: string;
}) {
	let $mode = _mode || mode();
	let $collection = _collection || collection();
	let formData = data instanceof FormData ? data : await col2formData(data);
	if (_mode === 'edit' && !id) {
		throw new Error('ID is required for edit mode.');
	}
	if (!formData) return;
	switch ($mode) {
		case 'create':
			return await addData({ data: formData, collectionName: $collection.path as any });
		case 'edit':
			formData.append('_id', id || entryData()._id);
			return await updateData({ data: formData, collectionName: $collection.path as any });
	}
}
