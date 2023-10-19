import widgets from '@src/components/widgets';

let schema = {
	fields: [
		widgets.MegaMenu({
			menu: [
				[
					widgets.Text({ label: 'link', translated: true }),
					widgets.Text({ label: 'info', translated: true }),
					widgets.Text({ label: 'info3', translated: true })
				],
				[
					widgets.Text({ label: 'link', translated: true }),
					widgets.Text({ label: 'info', translated: true }),
					widgets.Text({ label: 'info3', translated: true })
				]
			],
			label: 'Menu'
		})
	]
};
export default schema;
