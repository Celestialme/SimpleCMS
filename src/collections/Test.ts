import widgets from '../components/widgets';

import type { Schema } from './types';

let schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/
	name: 'Test Widgets',
	icon: 'bi:device-ssd-fill',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Text({
			title: 'First',
			icon: 'ri:t-box-line',
			placeholder: 'Enter First Name',
			required: true
			// entry_list: false,

			// localization: {DE, ES,}

			// interface translation:
			// DE{.
			// 	title: 'Vorname'
			// 	placeholder: 'Image Titel'}
			// 	icon: "ri:t-box-line",

			// ES{
			// 	title: 'Nombre'
			// 	placeholder: 'Image Titel'}
		}),

		widgets.Text({ title: 'Last', icon: 'ri:t-box-line', placeholder: 'Enter Last Name' }),

		widgets.Text({
			title: 'Full Text option',
			icon: 'carbon:character-whole-number',
			prefix: '€',
			suffix: 'cent',
			count: '10',
			placeholder: 'Enter Number',
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
			placeholder: 'Enter Number',
			required: true
		}),

		widgets.Radio({ title: 'Radio', color: 'red', required: true }),

		widgets.Checkbox({ title: 'Checkbox', color: 'green', required: true }),

		widgets.Address({ title: 'Address' }),

		widgets.Url({
			title: 'url',
			icon: 'carbon:character-whole-number',
			placeholder: 'Enter Website',
			required: true,
			localization: true
		}),

		widgets.RichText({ title: 'rich text' })
	]
};
export default schema;

// widgets.DateRange({ title: "DateRange Not working", required: true }),
// widgets.Date({ title: "DateNot working", required: true }),
