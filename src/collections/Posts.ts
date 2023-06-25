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
			translated: false,
			db_fieldName: 'dbtest',
			required: true,
			icon: 'ri:t-box-line',
			placeholder: 'Enter Test Placeholder',
			localization: true,

			display: async (data, field, entry) => {
				return data.translated;
			}
		}),

		widgets.ImageUpload({
			label: 'image',
			path: 'mediafiles/images'
		})
	]
};
export default schema;
