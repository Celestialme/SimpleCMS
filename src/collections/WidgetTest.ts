import { redirect } from '@sveltejs/kit';
import widgets from '@src/components/widgets';
import { roles } from './Auth';
import type { Schema } from './types';

// typesafe-i18n
import LL from '@src/i18n/i18n-svelte';
import { get } from 'svelte/store';

let schema: Schema = {
	// Collection Name required
	name: 'widget-test',

	// Collection Permissions by user Roles
	permissions: {
		[roles.user]: {
			read: false
		}
	},

	// Optional & Icon , status, slug
	// See for possible Icons https://icon-sets.iconify.design/
	icon: 'bi:card-text',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Text({
			db_fieldName: 'First',
			label: get(LL).COLLECTION_TEST_First(),
			icon: 'ri:t-box-line',
			placeholder: get(LL).COLLECTION_TEST_First_placeholder(),
			required: true,
			translated: true,
			width: '33%'
		}),

		widgets.Text({
			db_fieldName: 'Middle',
			label: get(LL).COLLECTION_TEST_Middle(),
			icon: 'ri:t-box-line',
			placeholder: get(LL).COLLECTION_TEST_Middle_placeholder(),
			readonly: true,
			width: '13%'
		}),

		widgets.Text({
			db_fieldName: 'Last',
			label: get(LL).COLLECTION_TEST_Last(),
			icon: 'ri:t-box-line',
			placeholder: get(LL).COLLECTION_TEST_Last_placeholder(),

			width: '53%',
			translated: true,
			disabled: true
		}),

		widgets.Text({
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

		widgets.Email({
			label: 'email',
			db_fieldName: 'Email',
			icon: 'material-symbols:mail-outline',
			placeholder: 'Enter Email',
			required: true
		}),

		widgets.RemoteVideo({
			label: 'RemoteVideo',
			db_fieldName: 'RemoteVideo',
			icon: 'mdi:youtube',
			placeholder: 'Enter RemoteVideo',
			required: true
		}),

		widgets.ColorPicker({
			label: 'ColorPicker',
			db_fieldName: 'ColorPicker',
			icon: 'bi:calendar3',
			required: true
		}),

		widgets.Date({
			label: 'Date',
			db_fieldName: 'Date',
			icon: 'bi:calendar3',
			required: true
		}),

		widgets.DateTime({
			label: 'DateTime',
			db_fieldName: 'DateTime',
			icon: 'bi:calendar3',
			required: true
		}),

		widgets.Number({
			label: 'Number',
			db_fieldName: 'Number',
			icon: 'carbon:character-whole-number',
			placeholder: 'Enter Number',
			required: true,
			prefix: 'height',
			suffix: 'mm',
			step: 0.01,
			translated: false
		}),

		widgets.Currency({
			label: 'Currency',
			db_fieldName: 'Currency',
			currencyCode: 'Euro',
			icon: 'carbon:character-whole-number',
			placeholder: 'Enter Currency',
			required: true,
			prefix: '€',
			suffix: 'Cent',
			step: 0.01,
			translated: false
		}),

		widgets.PhoneNumber({
			label: 'Phone Number',
			db_fieldName: 'Phone',
			icon: 'ph:phone',
			placeholder: 'Enter Phone no',
			required: true
		}),

		widgets.Radio({
			label: 'Radio',
			db_fieldName: 'Radio',
			icon: 'akar-icons:radio-fill',
			color: 'pink',
			required: true
		}),

		widgets.Checkbox({
			label: 'Checkbox',
			db_fieldName: 'Checkbox',
			icon: 'mdi:check-bold',
			color: 'pink',
			required: true
		}),

		widgets.Seo({
			label: 'Seo',
			db_fieldName: 'Seo',
			icon: 'tabler:seo',
			required: true
		})
	]
};
export default schema;
