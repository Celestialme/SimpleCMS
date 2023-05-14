import widgets from '../components/widgets';

let schema = {
	// Collection Name required
	name: 'posts3',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
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
