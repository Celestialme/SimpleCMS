import Posts from './Posts';
import widgets from '../components/widgets';
import type { Schema } from './types';

let schema: Schema = {
	// Collection Name & Icon (optional) shown on Sidebar
	// See for possible Icons https://icon-sets.iconify.design/
	name: 'Images',
	icon: 'bi:card-image',

	// Defined Fields that are used in Collection
	// Inspect Widget fields for possible options
	fields: [
		widgets.Text({ title: 'Name', icon: 'ri:t-box-line', placeholder: 'Enter Image Name' }),

		widgets.Relation({
			title: 'Relationship to Posts',
			icon: 'ri:t-box-line',
			relation: Posts,
			display: async (data: any, field: any, entry: any) => {
				return data.Name;
			}
		})
	]
};
export default schema;
