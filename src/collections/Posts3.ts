import widgets from '../components/widgets';
let schema = {
	name: 'posts3',
	fields: [
		widgets.Text({
			label: 'text'
		}),
		widgets.Text({
			label: 'text2'
		}),
		widgets.Text({
			label: 'text3'
		})
	]
};
export default schema;
