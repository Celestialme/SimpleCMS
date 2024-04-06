import { roles } from '@src/auth/types';
export let permissions = ['read', 'write'];
export let defaultPermissions = roles.reduce((acc, role) => {
    return {
        ...acc,
        [role]: permissions.reduce((acc, permission) => {
            switch (role) {
                case 'admin' || 'developer':
                    return { ...acc, [permission]: true };
                case 'user':
                    return { ...acc, [permission]: true, write: false };
                default:
                    return { ...acc, [permission]: false };
            }
        }, {})
    };
}, {});
export let sanitizePermissions = (permissions) => {
    let res = Object.keys(permissions).reduce((acc, r) => {
        acc[r] = Object.keys(permissions[r]).reduce((acc, p) => {
            if (permissions[r][p] == false) {
                acc[p] = false;
            }
            return acc;
        }, {});
        if (Object.keys(acc[r]).length == 0)
            delete acc[r];
        return acc;
    }, {});
    if (Object.keys(res).length == 0)
        return undefined;
    return res;
};
