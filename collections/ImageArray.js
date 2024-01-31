let schema = {
    icon: 'bi:images',
    fields: [
        ...globalThis.widgets.ImageArray({
            uploader_path: 'images',
            uploader_label: 'image 2',
            label: 'ImageArray',
            fields: [
                globalThis.widgets.Text({
                    label: 'title',
                    db_fieldName: 'title',
                    translated: false
                })
            ]
        }).fields
    ]
};
export default schema;
