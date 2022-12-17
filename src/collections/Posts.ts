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
		widgets.Text({
			title: 'Test',
			icon: 'ri:t-box-line',
			placeholder: 'Enter First Name',
			required: true,
			localization:true
		}),
		widgets.Text({
			title: 'name',
			icon: 'ri:t-box-line',
			placeholder: 'Enter First Name',
			required: true,
			localization:true
		})
	]
};
export default schema;

// widgets.DateRange({ title: "DateRange Not working", required: true }),
// widgets.Date({ title: "DateNot working", required: true }),
