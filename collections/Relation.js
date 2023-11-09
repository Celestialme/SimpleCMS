let schema = {
    fields: [
        globalThis.widgets.Relation({
            label: 'relation',
            relation: 'Posts3',
            display({ data, contentLanguage }) {
                return data?.['text 2'][contentLanguage];
            }
        }),
        globalThis.widgets.Relation({
            label: 'relation2',
            relation: 'Posts3',
            display({ data, contentLanguage }) {
                return data?.['text 2'][contentLanguage];
            }
        })
    ]
};
export default schema;
