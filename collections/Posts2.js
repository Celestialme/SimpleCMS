let schema = {
    icon: 'iconoir:post',
    fields: [
        globalThis.widgets.Relation({ label: 'relation', relation: 'media', displayPath: 'image' }),
        globalThis.widgets.Text({ label: 'text', translated: true, permissions: { user: { write: false }, admin: { write: false } } }),
        globalThis.widgets.Text({ label: 'text2' })
    ]
};
export default schema;
