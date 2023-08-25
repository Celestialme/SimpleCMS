import widgets from '@src/components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

const schema: Schema = {
	// Collection Name required
	name: 'posts2',

	// Collection Permissions by user Roles
	permissions: {
		[roles.user.name]: {
			read: false
		},
		[roles.admin.name]: {
			write: false
		}
	},

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',

	// Defined Fields that are used in Collection
	// Widget fields can be inspected for individual options
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
