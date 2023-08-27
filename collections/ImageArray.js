let schema = {
    name: 'images',
    fields: [
        globalThis.widgets.ImageArray({
            label: 'images',
            fields: [
                globalThis.widgets.ImageUpload({
                    label: 'image',
                    path: 'media/images'
                }),
                globalThis.widgets.Text({
                    label: 'title',
                    db_fieldName: 'title',
                    translated: false
                })
            ]
        })
    ]
};
export default schema;
