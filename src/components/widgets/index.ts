import ImageArray from './ImageArray';
import ImageUpload from './ImageUpload';
import { GuiSchema } from './ImageUpload/types';
import Input from './Input';
import MegaMenu from './MegaMenu';
import Relation from './Relation';
import RichText from './RichText';

import type { Model, User } from '@src/auth/types';
import type mongoose from 'mongoose';

let widgets = {
	ImageArray,
	Input,
	ImageUpload,
	MegaMenu,
	Relation,
	RichText
} as const;

type K = (typeof widgets)[keyof typeof widgets]['Name'];
export type ModifyRequestParams<T extends (...args: any) => any> = {
	collection: Model;
	id: mongoose.Types.ObjectId;
	field: ReturnType<T>;
	data: { get: () => any; update: (newData) => void };
	entry?: { [key: string]: any };
	user: User;
	type: 'GET' | 'POST' | 'DELETE' | 'PATCH';
	meta_data?: { [key: string]: any };
};
export type WidgetType = {
	[key in K]: (typeof widgets)[key] & {
		modifyRequest: (
			args: ModifyRequestParams<(typeof widgets)[keyof typeof widgets]>
		) => Promise<{}>;
	};
};

export type GuiSchema = WidgetType[keyof WidgetType]['GuiSchema'];
export default widgets as WidgetType;
export let widgetKeys = Object.keys(widgets) as unknown as keyof WidgetType;
