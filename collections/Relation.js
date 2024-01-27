let schema = {
    icon: 'lets-icons:menu',
    fields: [
        globalThis.widgets.Relation({
            label: 'relation',
            relation: 'Posts3',
            display({ data, contentLanguage }) {
                return data?.['text 2']?.[contentLanguage];
            }
        })
    ]
};
export default schema;
