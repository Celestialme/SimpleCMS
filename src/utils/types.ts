import type mongoose from 'mongoose';
import type { SIZES } from './utils';

export type ImageFiles = { hash: string; _id: string; used_by: mongoose.Types.ObjectId[] } & Record<
	keyof typeof SIZES,
	{
		name: string;
		url: string;
		size: number;
		type: string;
		lastModified: number;
		width: number;
		height: number;
	}
>;
