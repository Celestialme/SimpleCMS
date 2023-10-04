let schema = {
    fields: [
        globalThis.widgets.ImageArray({
            fields: [
                globalThis.widgets.ImageUpload({
                    label: 'image',
                    path: 'images'
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
