import widgets from '../components/widgets';
let schema = {
	// Collection Name required
	name: 'names',
	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',
	slug: ' names',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Text({
			label: 'First Name',
			translated: false,
			icon: 'ri:t-box-line',
			placeholder: 'Enter First Name'
		}),
		widgets.Text({
			label: 'Last Name',
			translated: false,
			icon: 'ri:t-box-line'
		})
	]
};
export default schema;
