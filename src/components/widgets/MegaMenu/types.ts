import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import GuiFields from './GuiFields.svelte';
import { type WidgetType } from '..';
type Fields = ReturnType<WidgetType[keyof WidgetType]>[][];
export type Params = {
	id?: string;
	widget?: any;
	db_fieldName?: string;
	label: string;
	width?: number;
	fields: Fields;
	display?: DISPLAY;
};
export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	fields: { widget: GuiFields, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true }
};

export interface CustomDragEvent extends Event {
	detail: {
		closest_index: number;
		clone_index: number;
		dragged_item: any;
		isParent: boolean;
		expanded_list: [boolean];
		refresh_expanded_list: () => void;
	};
}
