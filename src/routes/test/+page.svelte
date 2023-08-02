<script lang="ts">
	let numberInput: HTMLInputElement;
	let language = 'en-US';
	let value = '';

	function handleInput(event: Event) {
		const target = event.target as HTMLInputElement;
		const value = target.value;
		const decimalSeparator = getDecimalSeparator(language);
		if (value[value.length - 1] !== decimalSeparator) {
			const number = parseFloat(
				value
					.replace(new RegExp(`[^0-9${decimalSeparator}]`, 'g'), '')
					.replace(decimalSeparator, '.')
			);
			if (!isNaN(number)) {
				target.value = new Intl.NumberFormat(language, { maximumFractionDigits: 20 }).format(
					number
				);
			} else {
				target.value = value;
			}
		}
	}

	function toggleLanguage() {
		language = language === 'en-US' ? 'de-DE' : 'en-US';
	}

	function getDecimalSeparator(language: string) {
		const numberWithDecimalSeparator = new Intl.NumberFormat(language).format(1.1);
		return numberWithDecimalSeparator.substring(1, 2);
	}

	$: if (numberInput) {
		const value = numberInput.value;
		const decimalSeparator = getDecimalSeparator(language);
		const number = parseFloat(
			value.replace(new RegExp(`[^0-9${decimalSeparator}]`, 'g'), '').replace(decimalSeparator, '.')
		);
		if (!isNaN(number)) {
			numberInput.value = new Intl.NumberFormat(language, { maximumFractionDigits: 20 }).format(
				number
			);
		} else {
			numberInput.value = value;
		}
	}
</script>

<div>
	<label for="number-input">Enter a number:</label>
	<input
		id="number-input"
		type="text"
		class="input"
		bind:value
		bind:this={numberInput}
		on:input|preventDefault={handleInput}
	/>
	<button class="btn variant-filled-primary" on:click={toggleLanguage}>Toggle Language</button>
	: {language}
</div>
Saved Value: {value}
