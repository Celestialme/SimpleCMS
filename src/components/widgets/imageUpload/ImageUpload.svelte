<script lang="ts">
	import axios from 'axios';
	export let field = { title: '', path: '' };
	export let value: any;
	export let widgetValue;

	function setFile(node: HTMLInputElement) {
		if (value.type) {
			let fileList = new DataTransfer();
			fileList.items.add(value);
			widgetValue = node.files = fileList.files;
		} else {
			axios
				.get(`${field.path}/${value.originalname}`, { responseType: 'blob' })
				.then(({ data }) => {
					let fileList = new DataTransfer();
					let file = new File([data], value.originalname, {
						type: value.mimetype
					});
					fileList.items.add(file);
					widgetValue = node.files = fileList.files;
				});
		}
		node.onchange = (e) => (widgetValue = (e.target as HTMLInputElement).files);
	}
</script>

<input
	use:setFile
	name={field.title}
	class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
	type="file"
/>
