import widgets from '../components/widgets';
let schema = {
	name: 'posts1',
	fields: [
		widgets.Text({
			label: 'text',
			display: async (data, field, entry) => {
				return data;
			}
		}),
		widgets.ImageUpload({
			label: 'image',
			path: 'media/images'
		})
	]
};
export default schema;
