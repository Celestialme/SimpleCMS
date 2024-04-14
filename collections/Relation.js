let schema = {
    icon: 'lets-icons:menu',
    fields: [
        globalThis.widgets.Text({
            label: 'info',
            translated: true
        }),
        globalThis.widgets.Relation({
            label: 'relation2',
            relation: 'Posts3',
            displayPath: 'text 1'
        })
    ]
};
export default schema;
