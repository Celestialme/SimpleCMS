import publicConfig from '@root/config/public';
import type { Permissions } from '@src/collections/types';
import PermissionsTable from '@src/components/PermissionsTable.svelte';
import Toggle from '@src/components/system/buttons/Toggle.svelte';
import FloatingInput from '@src/components/system/inputs/FloatingInput.svelte';

export type Params = {
	label: string;
	width?: number;
	display?: DISPLAY;
	db_fieldName?: string;
	translated?: boolean;
	permissions?: Permissions;
};

export let GuiSchema = {
	label: { widget: FloatingInput, required: true },
	display: { widget: FloatingInput, required: true },
	db_fieldName: { widget: FloatingInput, required: true },
	translated: { widget: Toggle, required: false },
	permissions: { widget: PermissionsTable, required: false }
};

export let GraphqlSchema: GraphqlSchema = ({ label, collection }) => {
	let typeName = `${collection.name}_${label}`;
	return {
		typeName,
		graphql: /* GraphQL */ `
		type ${typeName} {
			${publicConfig.AVAILABLE_CONTENT_LANGUAGES.map((contentLanguage) => `${contentLanguage}: String`).join('\n')}
		}
	`
	};
};
