import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import { SIZES } from '@src/utils/files';
import publicConfig from '@root/config/public';
export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	folder: (typeof publicConfig.FOLDERS)[number];
	width?: number;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	folder: { widget: FloatingInput, required: true },
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
export let GraphqlSchema: GraphqlSchema = ({ field, label, collection }) => {
	let typeName = `${collection.name}_${label}`;
	console.log(typeName);
	return {
		typeName,
		graphql: /* GraphQL */ `
		${types}
		type ${typeName} {
			${Object.keys(SIZES)
				.map((size) => `${size}: ${size}`)
				.join('\n')}
		}
	`
	};
};
