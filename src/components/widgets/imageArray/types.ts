import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import type DefaultWidgets from '@src/components/widgets';
import { getFieldName } from '@src/utils/utils';
import widgets from '@src/components/widgets';

export type Params = {
	db_fieldName?: null;
	label: string;
	icon?: string;
	required?: boolean;
	widget?: any;
	fields: any;
	display?: DISPLAY;
	uploader_label: string;
	uploader_path: string;
	uploader_display?: DISPLAY;
	uploader_db_fieldName?: string;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	uploader_path: { widget: FloatingInput, required: true },
	uploader_label: { widget: FloatingInput, required: true }
};

export let GraphqlSchema: GraphqlSchema = ({ field, label, collection }) => {
	let fieldTypes = '';
	for (let _field of field.fields) {
		fieldTypes += widgets[_field.widget.key].GraphqlSchema({ label: getFieldName(_field, true), collection }).graphql + '\n';
	}

	return {
		typeName: null, // imageArray does not have its own typeName in DB so its null. it unpacks fieldTypes directly
		graphql: /* GraphQL */ `
			${fieldTypes}
		`
	};
};
