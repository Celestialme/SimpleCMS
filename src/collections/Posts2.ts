import widgets from '../components/widgets';
let schema = {
	name: 'posts2',
	fields: [
		widgets.Text({
			label: 'text'
		}),
		widgets.Text({
			label: 'text2'
		})
	]
};
export default schema;
