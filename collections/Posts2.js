let schema = {
    icon: 'iconoir:post',
    fields: [
        globalThis.widgets.Relation({ label: 'relation', relation: 'Posts3', displayPath: 'text 1' }),
        globalThis.widgets.Text({ label: 'text', translated: true }),
        globalThis.widgets.Text({ label: 'text2' })
    ]
};
export default schema;
