let schema = {
    fields: [
        globalThis.widgets.Email({
            display: async ({ data, field, entry, contentLanguage }) => {
                return data[contentLanguage];
            },
            label: 'email'
        }),
        globalThis.widgets.Text({ label: 'text', translated: false }),
        globalThis.widgets.ImageUpload({ label: 'image', path: 'media/images' })
    ]
};
export default schema;
