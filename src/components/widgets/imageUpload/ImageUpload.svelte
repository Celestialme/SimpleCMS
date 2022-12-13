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

	import FilePond, { registerPlugin, supported } from 'svelte-filepond';

	// Import the Image EXIF Orientation and Image Preview plugins
	// Note: These need to be installed separately
	// `npm i filepond-plugin-image-preview filepond-plugin-image-exif-orientation --save`
	import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
	import FilePondPluginImagePreview from 'filepond-plugin-image-preview';

	// Register the plugins
	registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

	// a reference to the component, used to call FilePond methods
	let pond;

	// pond.getFiles() will return the active files

	// the name to use for the internal file input
	let name = 'filepond';

	// handle filepond events
	function handleInit() {
		console.log('FilePond has initialised');
	}

	function handleAddFile(err, fileItem) {
		console.log('A file has been added', fileItem);
	}
</script>

<input
	use:setFile
	name={field.title}
	class="block w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 cursor-pointer dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400"
	type="file"
/>

<div class="app">
	<FilePond
		bind:this={pond}
		{name}
		server="/api"
		allowMultiple={true}
		oninit={handleInit}
		onaddfile={handleAddFile}
		credits="false"
	/>
</div>

<style global>
	@import 'D-plugin-image-preview/dist/filepond-plugin-image-preview.css';
	@import 'filepond/dist/filepond.css';
</style>
