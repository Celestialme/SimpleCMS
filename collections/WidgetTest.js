import { roles } from './types.js';
// typesafe-i18n
import LL from '@src/i18n/i18n-svelte';
import { get } from 'svelte/store';
const schema = {
    // Collection Name comming from filename
    // Optional & Icon , status, slug
    // See for possible Icons https://icon-sets.iconify.design/
    icon: 'bi:card-text',
    // Collection Permissions by user Roles
    permissions: {
        [roles.user]: {
            read: false
        }
    },
    // Defined Fields that are used in Collection
    // Widget fields can be inspected for individual options
    fields: [
        globalThis.widgets.Text({
            db_fieldName: 'First',
            label: get(LL).COLLECTION_TEST_First(),
            icon: 'ri:t-box-line',
            placeholder: get(LL).COLLECTION_TEST_First_placeholder(),
            required: true,
            translated: true,
            width: '33%'
        }),
        globalThis.widgets.Text({
            db_fieldName: 'Middle',
            label: get(LL).COLLECTION_TEST_Middle(),
            icon: 'ri:t-box-line',
            placeholder: get(LL).COLLECTION_TEST_Middle_placeholder(),
            readonly: true,
            width: '13%'
        }),
        globalThis.widgets.Text({
            db_fieldName: 'Last',
            label: get(LL).COLLECTION_TEST_Last(),
            icon: 'ri:t-box-line',
            placeholder: get(LL).COLLECTION_TEST_Last_placeholder(),
            width: '53%',
            translated: true,
            disabled: true
        }),
        globalThis.widgets.Text({
            db_fieldName: 'Full Text option',
            label: get(LL).COLLECTION_TEST_Full_Text_Option(),
            icon: 'carbon:character-whole-number',
            prefix: 'pre',
            suffix: 'suf',
            count: 10,
            minlength: 2,
            maxlength: 15,
            placeholder: get(LL).COLLECTION_TEST_Full_Text_Option_Placeholder(),
            translated: true,
            required: true
        }),
        globalThis.widgets.Email({
            label: 'email',
            db_fieldName: 'Email',
            icon: 'material-symbols:mail-outline',
            placeholder: 'Enter Email',
            required: true
        }),
        globalThis.widgets.RemoteVideo({
            label: 'RemoteVideo',
            db_fieldName: 'RemoteVideo',
            icon: 'mdi:youtube',
            placeholder: 'Enter RemoteVideo',
            required: true
        }),
        globalThis.widgets.ColorPicker({
            label: 'ColorPicker',
            db_fieldName: 'ColorPicker',
            icon: 'bi:calendar3',
            required: true
        }),
        globalThis.widgets.Date({
            label: 'Date',
            db_fieldName: 'Date',
            icon: 'bi:calendar3',
            required: true
        }),
        globalThis.widgets.DateTime({
            label: 'DateTime',
            db_fieldName: 'DateTime',
            icon: 'bi:calendar3',
            required: true
        }),
        globalThis.widgets.Number({
            label: 'Number',
            db_fieldName: 'Number',
            icon: 'carbon:character-whole-number',
            placeholder: 'Enter Number',
            required: true,
            prefix: 'height',
            suffix: 'mm'
            // step: 0.01
        }),
        globalThis.widgets.Currency({
            label: 'Currency',
            db_fieldName: 'Currency',
            currencyCode: 'Euro',
            icon: 'carbon:character-whole-number',
            placeholder: 'Enter Currency',
            required: true,
            prefix: '€',
            suffix: 'Cent',
            step: 0.01
        }),
        globalThis.widgets.PhoneNumber({
            label: 'Phone Number',
            db_fieldName: 'Phone',
            icon: 'ph:phone',
            placeholder: 'Enter Phone no',
            required: true
        }),
        globalThis.widgets.Radio({
            label: 'Radio',
            db_fieldName: 'Radio',
            icon: 'akar-icons:radio-fill',
            color: 'pink',
            required: true
        }),
        globalThis.widgets.Checkbox({
            label: 'Checkbox',
            db_fieldName: 'Checkbox',
            icon: 'mdi:check-bold',
            color: 'pink',
            required: true
        }),
        globalThis.widgets.RichText({
            label: 'RichText',
            db_fieldName: 'RichText',
            icon: 'ri:t-box-line',
            required: true
        }),
        globalThis.widgets.Seo({
            label: 'Seo',
            db_fieldName: 'Seo',
            icon: 'tabler:seo',
            required: true
        })
    ]
};
export default schema;
