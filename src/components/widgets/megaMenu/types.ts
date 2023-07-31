import Input from '@src/components/system/inputs/Input.svelte';
import GuiFields from '@src/components/widgets/megaMenu/GuiFields.svelte';

export type Params = {
	label: string;
	display?: DISPLAY;
	db_fieldName?: string;
	widget?: any;
	schema?: { [Key: string]: any };
	translated?: boolean;
	// Widget Specific parameters
	menu: any[];
};

export let GuiSchema = {
	label: { widget: Input, required: true },
	display: { widget: Input, required: true },
	db_fieldName: { widget: Input, required: true },
	menu: { widget: GuiFields, required: true }
};
