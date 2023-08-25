import widgets from '@src/components/widgets';
import Posts from './Names';
import { roles } from './Auth';
import type { Schema } from './types';

const schema: Schema = {
	// Collection Name required
	name: 'relation 2 posts',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'mdi:relation-many-to-many',

	// Collection Permissions by user Roles

	// Defined Fields that are used in Collection
	// Widget fields can be inspected for individual options
	fields: [
		widgets.Relation({
			db_fieldName: 'relation',
			label: 'Relation M2M to Posts',
			relation: Posts
		})
	]
};
export default schema;
