import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import type ImageUpload from '@src/components/widgets/imageUpload';
import type DefaultWidgets from '@src/components/widgets';
import { SIZES } from '@src/utils/utils';
type ommited = Omit<typeof DefaultWidgets, 'ImageUpload'>;
type Widgets = ReturnType<ommited[keyof ommited]>;

type Widgets2 = [ReturnType<typeof ImageUpload>, ...Widgets[]];
export type Params = {
	db_fieldName?: string;
	label: string;
	icon?: string;
	required?: boolean;
	schema?: any;
	widget?: any;
	fields: Widgets2;
	display?: DISPLAY;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
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
