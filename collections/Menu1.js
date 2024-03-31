let schema = {
    icon: 'pepicons-pop:menu',
    fields: [
        globalThis.widgets.MegaMenu({
            fields: [[globalThis.widgets.Text({ label: 'link 1', translated: true }), globalThis.widgets.ImageUpload({ label: 'image', path: 'images' })]],
            label: 'Menu'
        })
    ]
};
export default schema;
