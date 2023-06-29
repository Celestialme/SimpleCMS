<script>
import { server } from './server';

export let imagePath;
export let thumbnailPath;

async function handleUpload() {
  const file = document.querySelector('#file').files[0];
  const imagePath = await server.uploadImage(file);
  const thumbnailPath = await server.createThumbnail(imagePath);
}
</script>

<input type="file" id="file" />
<button on:click={handleUpload}>Upload</button>

<p>Image path: {imagePath}</p>
<p>Thumbnail path: {thumbnailPath}</p>
