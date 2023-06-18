import type { RequestHandler } from '../$types';
import mongoose from 'mongoose';

export const get: RequestHandler = async () => {
	const collection = mongoose.connection.db.collection('<collection>');
	const images = await collection.find().toArray();

	return {
		body: images
	};
};
