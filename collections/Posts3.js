import { roles } from './types.js';
let schema = {
    permissions: {
        [roles.user]: {
            read: true
        },
        [roles.admin]: {
            write: true
        }
    },
    fields: [
        globalThis.widgets.Text({
            label: 'text 1',
            translated: false
        }),
        globalThis.widgets.Text({
            label: 'text 2',
            translated: false
        }),
        globalThis.widgets.Text({
            label: 'text 3',
            translated: false
        }),
        globalThis.widgets.Text({
            label: 'text 4',
            translated: false
        }),
        globalThis.widgets.Text({
            label: 'text 5',
            translated: false
        })
    ]
};
export default schema;
