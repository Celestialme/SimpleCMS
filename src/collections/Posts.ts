import widgets from '../components/widgets';

let schema = {
	// Collection Name required
	name: 'posts',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',
	status: 'published',
	slug: 'posts',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Text({
			label: 'test',
			db_fieldName: 'dbtest',
			translated: true,
			required: true,
			icon: 'ri:t-box-line',
			placeholder: 'Enter Test Placeholder',

			display: async (data) => {
				return data;
			}

			// display: async (data, field, entry) => {
			// 	return data.translated;
			// }
		}),

		widgets.ImageUpload({
			label: 'image',
			path: 'mediafiles/images'
		})
	]
};
export default schema;
