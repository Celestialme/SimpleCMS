import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import { SIZES } from '@src/utils/utils';

export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	path: (string & {}) | 'global' | 'unique';
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	path: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true }
};
let types = Object.keys(SIZES)
	.map(
		(size) =>
			`type ${size} {
	name: String
	url: String
	size: Int
	type: String
	lastModified: Float
}`
	)
	.join('\n');
export let GraphqlSchema = ({ field, label, collection }) => {
	return /* GraphQL */ `
		${types}
		type ${collection.name}_${label} {
			${Object.keys(SIZES)
				.map((size) => `${size}: ${size}`)
				.join('\n')}
		}
	`;
};
