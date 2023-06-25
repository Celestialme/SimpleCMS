import widgets from '../components/widgets';

let schema = {
	// Collection Name required
	name: 'Menu',

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:menu-button-wide',
	strict: false,
	status: 'published',
	slug: 'menu',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.MegaMenu({
			label: 'Menu',
			menu: [
				{
					fields: [
						widgets.Text({
							label: 'Header',
							translated: false
						})
					]
				},
				{
					fields: [
						widgets.Text({
							label: 'Header',
							translated: false
						}),
						widgets.Text({
							label: 'Header',
							translated: false
						})
					]
				}
			]
		})
	]
};
export default schema;
