import ImageArray from './imageArray';
import ImageUpload from './imageUpload';
import Text from './text';
import Email from './email';
import MegaMenu from './megaMenu';
import Relation from './relation';
import type { User } from '@src/auth/types';

let widgets = {
	ImageArray,
	Text,
	Email,
	ImageUpload,
	MegaMenu,
	Relation: Relation
};

type K = ReturnType<(typeof widgets)[keyof typeof widgets]>['widget']['key'];
export type WidgetType = {
	[key in K]: (typeof widgets)[key] & {
		modifyRequest: ({
			field,
			data,
			user,
			type
		}: {
			field: any;
			data: { [key: string]: any };
			user: User;
			type: 'GET' | 'POST' | 'DELETE' | 'PATCH';
		}) => {};
	};
};
export let initWidgets = () => (globalThis.widgets = widgets);
export default widgets as WidgetType;
