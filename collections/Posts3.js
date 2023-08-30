import { roles } from './types.js';
let schema = {
    permissions: {
        [roles.user]: {
            read: false
        },
        [roles.admin]: {
            write: false
        }
    },
    fields: [
        globalThis.widgets.Text({
            label: 'text',
            translated: false
        }),
        globalThis.widgets.Text({
            label: 'text2',
            translated: false
        }),
        globalThis.widgets.Text({
            label: 'text3',
            translated: false
        })
    ]
};
export default schema;
