let schema = {
	name: 'posts1',
	fields: [
		globalThis.widgets.Email({
			display: async (data, field, entry, contentLanguage) => {
				return data[contentLanguage];
			},
			label: 'email',
			translated: false
		}),
		globalThis.widgets.Text({ label: 'text', translated: false }),
		globalThis.widgets.ImageUpload({ label: 'image', path: 'media/images' })
	]
};
export default schema;
