import widgets from '../components/widgets';

import Posts from './Posts';

import type { Schema } from './types';

let schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/
	name: 'Menu',
	icon: 'bi:menu-button-wide',
	strict: false,

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.MegaMenu({
			title: 'Menus',
			menu: [
				{
					fields: [widgets.Text({ title: 'Name', icon: 'ri:t-box-line' })]
				},
				{
					fields: [
						widgets.Text({ title: 'Name', icon: 'ri:t-box-line' }),
						widgets.Relation({
							title: 'bla_name',
							icon: 'ri:t-box-line',
							relation: Posts,
							display: async (data: any, field: any, entry: any) => {
								return data.name;
							}
						})
					]
				},
				{
					fields: [
						widgets.Text({ title: 'Name', icon: 'ri:t-box-line' }),
						widgets.Text({ title: 'Img', icon: 'bi:card-image' }),
						widgets.Text({ title: 'Address' })
					]
				},
				{
					fields: [
						widgets.Text({ title: 'Name', icon: 'ri:t-box-line' }),
						widgets.Text({ title: 'Img', icon: 'bi:card-image' }),
						widgets.Text({ title: 'Address' })
					]
				}
			]
		})
	]
};
export default schema;
