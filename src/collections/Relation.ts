import widgets from '../components/widgets';
import Posts from './Posts2';
let schema = {
	name: 'relation',
	fields: [
		widgets.Relation({
			label: 'relation',
			relation: Posts
		})
	]
};
export default schema;
