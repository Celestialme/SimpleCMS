import ImageArray from './imageArray';
import ImageUpload from './imageUpload';
import Text from './text';
import Email from './email';
import MegaMenu from './megaMenu';
import Relation from './relation';
import type { Model, User } from '@src/auth/types';

let widgets = {
	ImageArray,
	Text,
	Email,
	ImageUpload,
	MegaMenu,
	Relation: Relation
};

type K = ReturnType<(typeof widgets)[keyof typeof widgets]>['widget']['key'];
export type ModifyRequestParams<T extends (...args: any) => any> = {
	collection: Model;
	id?: string;
	field: ReturnType<T>;
	data: { [key: string]: any };
	user: User;
	type: 'GET' | 'POST' | 'DELETE' | 'PATCH';
};
export type WidgetType = {
	[key in K]: (typeof widgets)[key] & {
		modifyRequest: (args: ModifyRequestParams<(typeof widgets)[keyof typeof widgets]>) => Promise<{}>;
	};
};
export let initWidgets = () => (globalThis.widgets = widgets);
export default widgets as WidgetType;
