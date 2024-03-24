import { roles } from '@src/auth/types';
export let permissions = ['read', 'write'];
export let basePermissions = roles.reduce((acc, role) => {
    return {
        ...acc,
        [role]: permissions.reduce((acc, permission) => {
            return { ...acc, [permission]: false };
        }, {}),
        admin: permissions.reduce((acc, permission) => {
            return { ...acc, [permission]: true };
        }, {})
    };
}, {});
