import widgets from '../components/widgets';
let schema = {
	name: 'posts1',
	fields: [
		widgets.Text({
			label: 'text',
			translated: false,
			display: async (data, field, entry) => {
				return data.translated;
			}
		}),
		widgets.ImageUpload({
			label: 'image',
			path: 'media/images'
		})
	]
};
export default schema;
