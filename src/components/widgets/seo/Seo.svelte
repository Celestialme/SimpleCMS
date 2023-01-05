<script lang="ts">
	import { ProgressRadial } from '@skeletonlabs/skeleton';
	import Icon from '@iconify/svelte';

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
		suggestions = analyze(title, description);
	}

	function handleDescriptionChange(event) {
		description = event.target.value;
		descriptionCharacterWidth = calculateCharacterWidth(description, 14, 'Arial');
		suggestions = analyze(title, description);
	}

	// Function to analyze the title and  description
	let suggestions = analyze(title, description);
	let count = 0;
	let progress = 0;
	$: progress = (count / 15) * 100;

	function analyze(title, description) {
		let suggestions: any = [];
		let count: number = 0;

		// Check if the title is more than 50 characters
		if (title.length > 50) {
			suggestions.push({
				text: 'Your title is more than 50 characters. Perfect!',
				impact: 3
			});
			count += 3;
		}
		// Check if the title is more than 30 characters
		else if (title.length > 30) {
			suggestions.push({
				text: 'Your title is more than 30 characters. Good!',
				impact: 2
			});
			count += 2;
		}
		// Otherwise, the title is less than 30 characters
		else {
			suggestions.push({
				text: 'Your title is less than 30 characters. Bad!',
				impact: 1
			});
			count += 1;
		}

		// Check if the description is between 120 and 165 characters
		if (description.length >= 120 && description.length <= 165) {
			suggestions.push({
				text: 'Your description is between 120 and 165 characters. Perfect!',
				impact: 3
			});
			count += 3;
		}
		// Check if the description is more than 90 characters
		else if (description.length > 90) {
			suggestions.push({
				text: 'Your description is more than 90 characters. Good!',
				impact: 2
			});
			count += 2;
		}
		// Otherwise, the description is less than 90 characters
		else {
			suggestions.push({
				text: 'Your description is less than 90 characters. Bad!',
				impact: 1
			});
			count += 1;
		}

		// Check if the meta description is 2 to 4 sentences long
		const sentences = description.split('.');
		if (sentences.length >= 2 && sentences.length <= 4) {
			suggestions.push({
				text: 'Your description is 2 to 4 sentences long. Perfect!',
				impact: 3
			});
			count += 2;
		} else {
			suggestions.push({
				text: 'Your descripton is only 1 sentence long. Make sure your description is 2 to 4 sentences long.',
				impact: 1
			});
			count += 1;
		}

		// Check if the title uses numbers
		if (/\d/.test(title)) {
			suggestions.push({
				text: 'Your title uses numbers. Good!',
				impact: 3
			});
			count += 3;
		} else {
			suggestions.push({
				text: 'Your title does not use numbers. The use of numbers in your title can increase your CTR. Bad!',
				impact: 1
			});
			count += 1;
		}

		// Check if the title has a power word
		const powerWords = [
			'amazing',
			'attractive',
			'become',
			'best',
			'boost',
			'breaking',
			'breaking news',
			'cheap',
			'discover',
			'direct',
			'easy',
			'exclusive',
			'fresh',
			'full',
			'free',
			'free trial',
			'gain',
			'get',
			'grow',
			'hurry',
			'happiness',
			'health',
			'hot',
			'improve',
			'improvement',
			'innovative',
			'instant',
			'join',
			'latest',
			'limited',
			'limited time',
			'love',
			'new',
			'newsworthy',
			'powerful',
			'popular',
			'proven',
			'quality',
			'quick',
			'revolutionary',
			'save',
			'sale',
			'safety',
			'sign up',
			'special',
			'special offer',
			'solutions',
			'success',
			'support',
			'today',
			'trending',
			'trust',
			'urgent',
			'viral',
			'when',
			'winner',
			'worldwide',
			'wealth'
		];

		for (const word of powerWords) {
			if (title.toLowerCase().includes(word)) {
				suggestions.push({
					text: `Your title has the Power Word ${word}. Perfect!`,
					impact: 3
				});
				count += 3;
				break;
			}
		}

		// Check if the meta description has a power word
		for (const word of powerWords) {
			if (description.toLowerCase().includes(word)) {
				suggestions.push({
					text: `Your description uses the Power Word ${word}. Perfect!`,
					impact: 3
				});
				count += 3;
				break;
			}
		}

		// Define the list of CTA keywords
		const ctaKeywords = [
			'buy',
			'click here',
			'download now',
			'learn more',
			'sign up',
			'buy now',
			'shop now',
			'order now',
			'get started',
			'start your free trial',
			'request a quote',
			'join now',
			'find a location',
			'get your quote',
			'get your free guide',
			'see our plans'
		];

		// Check if the title has a CTA keyword
		for (const keyword of ctaKeywords) {
			if (title.toLowerCase().includes(keyword)) {
				suggestions.push({
					text: `Your title has the CTA keyword "${keyword}". Good!`,
					impact: 3
				});
				count += 3;
				break;
			}
		}

		// Check if the meta description has a CTA keyword
		for (const keyword of ctaKeywords) {
			if (description.toLowerCase().includes(keyword)) {
				suggestions.push({
					text: `Your description uses the CTA keyword "${keyword}". Good!`,
					impact: 3
				});
				count += 3;
				break;
			}
		}

		return suggestions;
	}
	console.log(count);
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

<div class="mt-2 flex justify-center dark:text-white">
	<ProgressRadial value={progress} class="mt-1 mr-4  w-20 text-white">{progress}%</ProgressRadial>
	<div class="mb-2">
		<div class="mb-1 flex gap-5">
			<h3>List of Suggestions:</h3>
			<div class="flex items-center gap-2">
				<Icon icon="mdi:close-octagon" color="red" width="24" />
				<span class="flex-auto">0 - 49</span>
			</div>
			<div class="flex items-center gap-2">
				<span><Icon icon="bi:hand-thumbs-up-fill" color="blue" width="24" /></span>
				<span class="flex-auto">50 - 79</span>
			</div>
			<div class="flex items-center gap-2">
				<span><Icon icon="material-symbols:check-circle-outline" color="green" width="24" /></span>
				<span class="flex-auto">80 - 100</span>
			</div>
		</div>
		<p>
			Optimize title & description for Google search results, to improve the visual appeal to brings
			more clicks to your website
		</p>
	</div>
</div>

<ul class="grid md:grid-cols-2">
	{#each suggestions as suggestion}
		<li class="flex items-start p-1">
			<div class="mr-4 flex-none">
				{#if suggestion.impact === 3}
					<Icon icon="material-symbols:check-circle-outline" color="green" width="24" />
				{:else if suggestion.impact === 2}
					<Icon icon="bi:hand-thumbs-up-fill" color="blue" width="24" />
				{:else}
					<Icon icon="mdi:close-octagon" color="red" width="24" />
				{/if}
			</div>
			<span class="flex-auto">{suggestion.text}</span>
		</li>
	{/each}
</ul>

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
