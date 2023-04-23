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
							label: 'Header'
						})
					]
				},
				{
					fields: [
						widgets.Text({
							label: 'Header'
						}),
						widgets.Text({
							label: 'info'
						})
					]
				}
			]
		})
	]
};
export default schema;
