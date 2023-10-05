import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import GuiField from './GuiField.svelte';

import type { Schema } from '@src/collections/types';
import { getFieldName } from '@src/utils/utils';
import mongoose from 'mongoose';

export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	relation: Schema;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	relation: {
		widget: GuiField,
		required: true,
		imports: ['import {relation} from "./{relation}"']
	}
};

export let GraphqlSchema: GraphqlSchema = ({ field, label, collection }) => {
	return {
		typeName: field.relation.name,
		graphql: '', // relation does not need its own graphql because it copies related collection type
		resolver: {
			[collection.name]: {
				async [getFieldName(field)](parent) {
					console.log(getFieldName(field));
					let res = await mongoose.models[field.relation.name as string].findById(parent[getFieldName(field)]).lean();

					return res;
				}
			}
		}
	};
};
