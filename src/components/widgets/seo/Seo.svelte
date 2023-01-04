<script lang="ts">
	export let field: any = undefined;
	export let value = '';

	export let widgetValue;
	$: widgetValue = value;

	let title = '';
	let titleCharacterWidth = 0;
	let description = '';
	let descriptionCharacterWidth = 0;

	function calculateCharacterWidth(character, fontSize, fontFamily) {
		const span = document.createElement('span');
		span.style.fontSize = `${fontSize}px`;
		span.style.fontFamily = fontFamily;
		span.innerHTML = character;
		document.body.appendChild(span);
		const characterWidth = span.offsetWidth;
		document.body.removeChild(span);
		return characterWidth;
	}

	function handleTitleChange(event) {
		title = event.target.value;
		titleCharacterWidth = calculateCharacterWidth(title, 16, 'Arial');
		console.log(`The title is ${titleCharacterWidth} pixels wide.`);
	}

	function handleDescriptionChange(event) {
		description = event.target.value;
		descriptionCharacterWidth = calculateCharacterWidth(description, 14, 'Arial');
		console.log(`The description is ${descriptionCharacterWidth} pixels wide.`);
	}
</script>

<div class="input-container rounded">
	<label
		class={title.length >= 50 && title.length <= 60
			? 'input-label green'
			: title.length >= 30 && title.length <= 49
			? 'input-label orange'
			: title.length < 30
			? 'input-label'
			: 'input-label red'}
	>
		<div class="flex justify-between">
			<div class="text-black dark:text-white">Title:</div>
			<div>
				Character: {title.length} - Desktop: {titleCharacterWidth}/600px Mobile: {titleCharacterWidth}/654px
			</div>
		</div>
	</label>
	<input
		id="title-input"
		type="text"
		class="rounded-md"
		placeholder="SEO Titel"
		required
		bind:value={title}
		on:input={handleTitleChange}
	/>
</div>

<div class="input-container">
	<label
		class={description.length >= 150 && description.length <= 155
			? 'input-label green'
			: description.length >= 30 && description.length <= 149
			? 'input-label orange'
			: description.length < 30
			? 'input-label'
			: 'input-label red'}
	>
		<div class="flex justify-between">
			<div class="text-black dark:text-white">Description:</div>
			<div>
				Character: {description.length} - Desktop: {descriptionCharacterWidth}/970px Mobile: {descriptionCharacterWidth}/981px
			</div>
		</div>
	</label>
	<input
		id="description-input"
		type="text"
		class="rounded-md"
		required
		placeholder="SEO Description"
		bind:value={description}
		on:input={handleDescriptionChange}
	/>
</div>

<div
	class="dark:boder-white mt-2 rounded border border-gray-500 dark:border-white dark:bg-transparent"
>
	<h2 class="mb-1 p-2 text-center text-black underline dark:text-white">SimpleCMS SEO Preview</h2>
	<h3 class="px-4 text-blue-700">{title}</h3>
	<p class="-mt-1 p-4 text-lg text-black">{description}</p>
	<p class="text-md mb-2 -mt-2 px-4 !text-gray-500">https://www.google.de</p>
</div>

<style>
	.input-label {
		color: gray;
	}
	.input-label.green {
		color: green;
	}
	.input-label.orange {
		color: orange;
	}
	.input-label.red {
		color: red;
	}
</style>
