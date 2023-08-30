let schema = {
	fields: [
		globalThis.widgets.MegaMenu({
			menu: [
				{ fields: [globalThis.widgets.Text({ label: 'Header', translated: true })] },
				{
					fields: [
						globalThis.widgets.Text({ label: 'Header', translated: true }),
						globalThis.widgets.Text({ label: 'link', translated: true }),
						globalThis.widgets.Text({ label: 'info', translated: true }),
						globalThis.widgets.Text({ label: 'info3', translated: true })
					]
				}
			],
			label: 'Menu'
		})
	]
};
export default schema;
