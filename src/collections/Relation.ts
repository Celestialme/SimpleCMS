import widgets from '../components/widgets';
import Posts from './Names';

let schema = {
	// Collection Name required
	name: 'relation 2 posts',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'mdi:relation-many-to-many',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Relation({
			db_fieldName: 'relation',
			label: 'Relation M2M to Posts',
			relation: Posts
		})
	]
};
export default schema;
