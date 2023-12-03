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
            translated: false,
            width: 2
        }),
        globalThis.widgets.Text({
            label: 'text 2',
            translated: false,
            width: 2
        }),
        globalThis.widgets.Text({
            label: 'text 3',
            translated: false,
            width: 2
        }),
        globalThis.widgets.Text({
            label: 'text 4',
            translated: false,
            width: 2
        }),
        globalThis.widgets.Text({
            label: 'text 5',
            translated: false,
            width: 1
        })
    ]
};
export default schema;
