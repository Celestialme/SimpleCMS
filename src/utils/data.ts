import axios from 'axios';
import { config, toFormData } from './utils';
import type { CollectionNames } from '@src/collections/types';

export async function getData(query: {
	collectionName: CollectionNames;
	page?: number;
	limit?: number;
	contentLanguage?: string;
	filter?: string;
	sort?: string;
}) {
	let q = toFormData({ method: 'GET', ...query });
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
	collectionName: CollectionNames;
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
	collectionName: CollectionNames;
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
	collectionName: CollectionNames;
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
	collectionName: CollectionNames;
}) {
	data.append('collectionName', collectionName);
	data.append('method', 'SETSTATUS');
	return await axios.post(`/api/query`, data, config).then((res) => res.data);
}
