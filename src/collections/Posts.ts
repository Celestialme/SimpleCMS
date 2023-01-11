import env from '@root/env';
import { format } from '@src/utils/utils';
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
			title: 'User',
			display: async (data: any, field: any, entry: any) => {
				return format([
					{
						label: 'Name',
						text: entry.first,

						newLine: true
					},
					{
						text: entry.middle,
						labelColor: 'blue',
						textColor: 'yellow',
						newLine: false
					},
					{
						text: entry.last,
						labelColor: 'blue',
						textColor: 'green',
						newLine: false
					}
				]);
			},
			fields: [
				widgets.Text({
					title: 'First',
					icon: 'ri:t-box-line',
					placeholder: 'Enter First Name',
					required: true,
					localization: true,
					width: '30%'
				}),

				widgets.Text({
					title: 'Middle',
					icon: 'ri:t-box-line',
					placeholder: 'Enter Last Name',
					required: false,
					localization: false,
					width: '70%'
				}),
				widgets.Text({
					title: 'Last',
					icon: 'ri:t-box-line',
					placeholder: 'Enter Last Name',
					required: false,
					localization: false
				})
			]
		})
	]
};
export default schema;

// widgets.DateRange({ title: "DateRange Not working", required: true }),
// widgets.Date({ title: "DateNot working", required: true }),
