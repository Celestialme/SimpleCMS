import widgets from '../components/widgets';
let schema = {
	name: 'posts2',
	fields: [
		widgets.Text({
			label: 'text',
			translated: false
		}),
		widgets.Text({
			label: 'text2',
			translated: false
		})
	]
};
export default schema;
