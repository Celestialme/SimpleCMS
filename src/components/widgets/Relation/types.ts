import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import GuiField from './GuiField.svelte';

export type Params<K, T> = {
	id?: string;
	label: string;
	width?: number;
	displayPath: K;
	db_fieldName?: string;
	widget?: any;
	relation: T;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	relation: {
		widget: GuiField,
		required: true
		// imports: ['import {relation} from "./{relation}"']
	}
};
