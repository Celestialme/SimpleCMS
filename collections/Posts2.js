import { roles } from './types.js';
let schema = {
    name: 'posts2',
    permissions: {
        [roles.admin]: {
            read: false
        }
    },
    fields: [
        globalThis.widgets.Text({
            label: 'text',
            translated: true
        }),
        globalThis.widgets.Text({
            label: 'text2'
        })
    ]
};
export default schema;
