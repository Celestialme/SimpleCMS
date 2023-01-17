import widgets from '../components/widgets';
import { format } from '@src/utils/utils';

import type { Schema } from './types';

// typesafe-i18n
import LL from '@src/i18n/i18n-svelte';

let schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/
	name: 'Test Widgets',
	icon: 'bi:device-ssd-fill',
	status: 'published',
	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Group({
			db_fieldName: 'User',
			// label: {$LL.COLLECTION_TEST_User()},
			display: async (data: any, field: any, entry: any) => {
				return format([
					{
						// label: {$LL.COLLECTION_TEST_Prefix()},
						label: 'Prefix',
						text: entry.Prefix,
						newLine: true // not working
					},
					{
						label: 'Name',
						text: entry.First
					},
					{
						text: entry.Last,
						labelColor: 'blue',
						textColor: 'green',
						newLine: true // not working
					}
				]);
			},
			fields: [
				widgets.SelectList({
					db_fieldName: 'Prefix',
					// label: '{$LL.COLLECTION_TEST_Prefix()}',
					icon: 'ri:t-box-line',
					placeholder: '{$LL.COLLECTION_TEST_Prefix_placeholder()}',
					width: '100%'
					// options : ('Mr.', 'Ms.', 'Mrs.', 'Dr.');
				}),

				widgets.Text({
					db_fieldName: 'First',
					// label: '{$LL.COLLECTION_TEST_First()}',
					icon: 'ri:t-box-line',
					placeholder: '{$LL.COLLECTION_TEST_First_placeholder()}',
					required: true,
					width: '33%'
				}),

				widgets.Text({
					db_fieldName: 'Middle',
					// label: '{$LL.COLLECTION_TEST_Middle()}',
					icon: 'ri:t-box-line',
					placeholder: '{$LL.COLLECTION_TEST_Middle_placeholder()}',
					required: false,
					readonly: true,
					width: '33%'
				}),

				widgets.Text({
					db_fieldName: 'Last',
					// label: '{$LL.COLLECTION_TEST_Last()}',
					icon: 'ri:t-box-line',
					placeholder: '{$LL.COLLECTION_TEST_Last_placeholder()}',
					required: true,
					width: '33%'
				})
			]
		}),

		widgets.Text({
			db_fieldName: 'Full Text option',
			icon: 'carbon:character-whole-number',
			prefix: '€',
			suffix: 'cent',
			count: '10',
			minlength: '2',
			maxlength: '15',
			placeholder: 'Enter Number',
			localization: true,
			required: true
		}),

		widgets.Email({
			db_fieldName: 'Email',
			icon: 'carbon:character-whole-number',
			placeholder: 'Enter Email',
			required: true
		}),
		widgets.Number({
			db_fieldName: 'Number',
			icon: 'carbon:character-whole-number',
			required: true
		}),

		widgets.PhoneNumber({
			db_fieldName: 'Phone Number',
			icon: 'material-symbols:perm-phone-msg',
			required: true
		}),

		widgets.Group({
			db_fieldName: 'Test 2nd Group',
			fields: [
				widgets.Radio({ db_fieldName: 'Radio', color: 'red', required: true, width: '50%' }),

				widgets.Checkbox({ db_fieldName: 'Checkbox', color: 'green', width: '50%', required: true })
			]
		}),

		widgets.RichText({ db_fieldName: 'Description' }),

		widgets.Address({ db_fieldName: 'Address' }),

		widgets.Date({ db_fieldName: 'Date' }),

		// isse with dayjs
		// widgets.DateRange({ title: 'DateRange' }),

		widgets.Url({
			db_fieldName: 'Url',
			icon: 'carbon:character-whole-number',
			placeholder: 'Enter Website',
			required: true,
			localization: true
		}),

		widgets.Youtube({
			db_fieldName: 'Youtube',
			icon: 'bi:youtube',
			placeholder: 'Enter Youtube URL',
			required: true
		}),

		widgets.Seo({
			db_fieldName: 'Basic Seo',
			icon: 'icon-park-outline:seo',
			localization: true,
			required: true
		})
	]
};
export default schema;

// widgets.DateRange({ db_fieldName: "DateRange Not working", required: true }),
// widgets.Date({ db_fieldName: "DateNot working", required: true }),
