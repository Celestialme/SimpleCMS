let schema = {
    icon: 'iconoir:post',
    fields: [
        globalThis.widgets.Relation({ label: 'relation', relation: 'media' }),
        globalThis.widgets.Text({ label: 'text', translated: true, permissions: { user: { write: false }, developer: { write: false } } }),
        globalThis.widgets.Text({ label: 'text2' })
    ]
};
export default schema;
