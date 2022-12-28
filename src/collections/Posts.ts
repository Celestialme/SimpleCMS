import widgets from '../components/widgets';

import type { Schema } from './types';

let schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/
	name: 'Posts',
	icon: 'bi:card-text',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Group({
			title: 'Group',

			fields: [
				widgets.Text({
					title: 'first',
					icon: 'ri:t-box-line',
					placeholder: 'Enter First Name',
					required: true,
					localization: true,
					width: '50%'
				}),

				widgets.Text({
					title: 'last',
					icon: 'ri:t-box-line',
					placeholder: 'Enter Last Name',
					required: false,
					localization: false,
					width: '33%'
				})
			]
		}),

		widgets.Text({
			title: 'Post',
			icon: 'ri:t-box-line',
			placeholder: 'Enter Post',
			required: false,
			localization: false
		})
	]
};
export default schema;

// widgets.DateRange({ title: "DateRange Not working", required: true }),
// widgets.Date({ title: "DateNot working", required: true }),
