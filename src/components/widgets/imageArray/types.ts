import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import type ImageUpload from '@src/components/widgets/imageUpload';
import type DefaultWidgets from '@src/components/widgets';
import { getFieldName } from '@src/utils/utils';
import widgets from '@src/components/widgets';
import { graphql } from 'graphql';
type ommited = Omit<typeof DefaultWidgets, 'ImageUpload'>;
type Widgets = ReturnType<ommited[keyof ommited]>;

type Widgets2 = [ReturnType<typeof ImageUpload>, ...Widgets[]];
export type Params = {
	db_fieldName?: null;
	label?: null;
	icon?: string;
	required?: boolean;
	widget?: any;
	fields: Widgets2;
	display?: DISPLAY;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true }
};

export let GraphqlSchema: GraphqlSchema = ({ field, label, collection }) => {
	let fieldTypes = '';
	for (let _field of field.fields) {
		fieldTypes += widgets[_field.widget.key].GraphqlSchema({ label: getFieldName(_field), collection }).graphql + '\n';
	}

	return {
		typeName: null, // imageArray does not have its own typeName in DB so its null. it unpacks fieldTypes directly
		graphql: /* GraphQL */ `
			${fieldTypes}
		`
	};
};
