import Posts3 from './Posts3.js';
let schema = {
    fields: [
        globalThis.widgets.Relation({
            label: 'relation',
            relation: Posts3,
            display({ data, contentLanguage }) {
                return data.text2[contentLanguage];
            }
        }),
        globalThis.widgets.Relation({
            label: 'relation2',
            relation: Posts3,
            display({ data, contentLanguage }) {
                return data?.text2[contentLanguage];
            }
        })
    ]
};
export default schema;
