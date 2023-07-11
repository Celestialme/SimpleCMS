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
type WidgetType = { [key in K]: (typeof widgets)[key] };

export default widgets as WidgetType;
