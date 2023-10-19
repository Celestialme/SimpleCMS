import ImageArray from './imageArray';
import ImageUpload from './imageUpload';
import Text from './text';
import Email from './email';
import MegaMenu from './megaMenu';
import Relation from './relation';

let widgets = {
	ImageArray,
	Text,
	Email,
	ImageUpload,
	MegaMenu,
	Relation: Relation
};

type K = ReturnType<(typeof widgets)[keyof typeof widgets]>['widget']['key'];
export type WidgetType = { [key in K]: (typeof widgets)[key] };
export let initWidgets = () => (globalThis.widgets = widgets);
export default widgets as WidgetType;
