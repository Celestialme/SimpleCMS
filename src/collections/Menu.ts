import widgets from '../components/widgets';
let schema = {
	name: 'Menu',
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
							label: 'info',
							translated: false
						})
					]
				}
			]
		})
	]
};
export default schema;
