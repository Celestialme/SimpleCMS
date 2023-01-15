import widgets from '../components/widgets';
import { format } from '@src/utils/utils';

import type { Schema } from './types';

let schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/
	name: 'Test Widgets',
	icon: 'bi:device-ssd-fill',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Group({
			title: 'User',
			display: async (data: any, field: any, entry: any) => {
				return format([
					{
						label: 'Prefix',
						text: entry.prefix,
						newLine: true // not working
					},
					{
						label: 'Name',
						text: entry.first
					},
					{
						text: entry.middle,
						labelColor: 'red',
						textColor: 'yellow'
					},
					{
						text: entry.last,
						labelColor: 'blue',
						textColor: 'green',
						newLine: true // not working
					}
				]);
			},
			fields: [
				widgets.SelectList({
					title: 'Prefix',
					icon: 'ri:t-box-line',
					placeholder: 'Enter Prefix',
					width: '33%'
					// options : ('Mr.', 'Ms.', 'Mrs.', 'Dr.');
				}),

				widgets.Text({
					title: 'First',
					icon: 'ri:t-box-line',
					placeholder: 'Enter First Name',
					required: true,
					width: '33%'
				}),

				widgets.Text({
					title: 'Middle',
					icon: 'ri:t-box-line',
					placeholder: 'Middle  (ReadOnly)',
					required: false,
					readonly: true,
					width: '33%'
				}),

				widgets.Text({
					title: 'Last',
					icon: 'ri:t-box-line',
					placeholder: 'Enter Last Name',
					required: true,
					width: '33%'
				})
			]
		}),

		widgets.Text({
			title: 'Full Text option',
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
			title: 'Email',
			icon: 'carbon:character-whole-number',
			placeholder: 'Enter Email',
			required: true
		}),
		widgets.Number({
			title: 'Number',
			icon: 'carbon:character-whole-number',
			required: true
		}),

		widgets.PhoneNumber({
			title: 'Phone Number',
			icon: 'material-symbols:perm-phone-msg',
			required: true
		}),

		widgets.Group({
			title: 'Test 2nd Group',

			fields: [
				widgets.Radio({ title: 'Radio', color: 'red', required: true }),

				widgets.Checkbox({ title: 'Checkbox', color: 'green', required: true })
			]
		}),

		widgets.RichText({ title: 'Description' }),

		widgets.Address({ title: 'Address' }),

		widgets.Date({ title: 'Date' }),

		// isse with dayjs
		// widgets.DateRange({ title: 'DateRange' }),

		widgets.Url({
			title: 'Url',
			icon: 'carbon:character-whole-number',
			placeholder: 'Enter Website',
			required: true,
			localization: true
		}),

		widgets.Youtube({
			title: 'Youtube',
			icon: 'bi:youtube',
			placeholder: 'Enter Youtube URL',
			required: true
		}),

		widgets.Seo({
			title: 'Basic Seo',
			icon: 'icon-park-outline:seo',
			localization: true,
			required: true
		})
	]
};
export default schema;

// widgets.DateRange({ title: "DateRange Not working", required: true }),
// widgets.Date({ title: "DateNot working", required: true }),
