import widgets from '@src/components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

const schema: Schema = {
	// Collection Name required
	name: 'posts2',

	// Collection Permissions by user Roles
	permissions: {
		[roles.user]: {
			read: false
		},
		[roles.admin]: {
			write: false
		}
	},

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Text({
			label: 'text'
		}),
		widgets.Text({
			label: 'text2'
		}),
		widgets.Text({
			label: 'text3',
			translated: false
		})
	]
};
export default schema;
