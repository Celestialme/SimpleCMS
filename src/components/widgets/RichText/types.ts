import publicConfig from '@root/config/public';
import Toggle from '@src/components/system/buttons/Toggle.svelte';
import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';
import { toStringHelper } from '@src/utils/utils';
import { Parser } from 'htmlparser2';
export type Params = {
	label: string;
	width?: number;
	display?: DISPLAY;
	db_fieldName?: string;
	translated?: boolean;
	image_folder: (typeof publicConfig.FOLDERS)[number];
};

export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	translated: { widget: Toggle, required: false }
};
let parsed_text;
export function toString({ field, data }: { field: any; data: any }) {
	parsed_text = '';
	let parser = new Parser({
		ontext: (text) => {
			parsed_text += text.trim();
		}
	});

	return toStringHelper({
		field,
		data,
		path: (lang) => {
			parser.write(data.content[lang]);
			parser.end();
			return data.header[lang] + '\n' + parsed_text;
		}
	});
}
