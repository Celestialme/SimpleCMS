import Posts from './Posts';
import widgets from '../components/widgets';
import type { Schema } from './types';
import env from '../../env';
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
				console.log(data);

				return data.first;
			}
		})
	]
};
export default schema;
