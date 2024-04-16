import type { SIZES } from './utils';

export type ImageFiles = { hash: string } & Record<
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
