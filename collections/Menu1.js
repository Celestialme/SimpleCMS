let schema = {
    icon: 'pepicons-pop:menu',
    fields: [
        globalThis.widgets.MegaMenu({
            fields: [[globalThis.widgets.Text({ label: 'link 1', translated: true }), globalThis.widgets.Relation({ label: 'Image', relation: 'thumbs', displayPath: 'Image' })]],
            label: 'Menu'
        })
    ]
};
export default schema;
