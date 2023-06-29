import widgets from '../components/widgets';
let schema = {
	name: 'posts1',
	fields: [
		widgets.Email({
			label: 'email',
			translated: false
		}),
		widgets.Text({
			label: 'text',
			translated: false
		}),
		widgets.ImageUpload({
			label: 'image',
			path: 'media/images'
		})
	]
};
export default schema;
