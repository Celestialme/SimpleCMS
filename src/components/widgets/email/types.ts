import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';

export type Params = {
	label: string;
	width?: number;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true }
};
export let GraphqlSchema: GraphqlSchema = ({ label, collection }) => {
	let typeName = `${collection.name}_${label}`;
	return {
		typeName,
		graphql: /* GraphQL */ `
		type ${typeName} {
			en: String
		}
	`
	};
};
