<!-- 
This FloatingInput component has the following properties:

- type: The type of the input element. Can be either 'text' or 'password'.
- value: The value of the input element.
- label: The text to display in the floating label.
- icon: The icon to display next to the input element.
- labelClass: Additional classes to apply to the label element.
- inputClass: Additional classes to apply to the input element.
- error: The error message to display. Can be either a string or a function that returns a string.
- name: The name of the input element.
- required: Whether the input is required. Defaults to false.
- disabled: Whether the input is disabled. Defaults to false.
- minlength: The minimum length of the input value.
- maxlength: The maximum length of the input value.
- onInput: A callback function that is called when the input value changes.
 -->

<script lang="ts">
	// Define an interface for the input properties
	interface InputProps {
		disabled?: boolean;
		icon?: string;
		iconColor?: string;
		inputClass?: string;
		label?: string;
		labelClass?: string;
		maxlength?: number;
		minlength?: number;
		name?: string;
		onInput?: (value: string) => void;
		required?: boolean;
		showPasswordBackgroundColor?: 'light' | 'dark';
		textColor?: string;
		type?: 'text' | 'password';
		value?: string;
	}

	export let disabled: InputProps['disabled'] = false;
	export let icon: InputProps['icon'] = '';
	export let iconColor: InputProps['iconColor'] = 'gray-500';

	export let inputClass: InputProps['inputClass'] = '';
	export let label: InputProps['label'] = '';
	export let labelClass: InputProps['labelClass'] = '';
	export let minlength: InputProps['minlength'] = undefined;
	export let maxlength: InputProps['maxlength'] = undefined;
	export let name: InputProps['name'] = '';
	export let onInput: InputProps['onInput'] = (value) => {};
	export let required: InputProps['required'] = false;
	export let showPasswordBackgroundColor: InputProps['showPasswordBackgroundColor'] = 'light';
	export let textColor: InputProps['textColor'] = '!text-red-500';
	export let type: InputProps['type'] = 'text';
	export let value: InputProps['value'] = '';

	function getAutocompleteValue(label: string | undefined): string {
		if (label === undefined) {
			return '';
		}
		const normalizedLabel = label.toLowerCase().replace(/\s+/g, '');
		// Add checks for other types of labels here
		return '';
	}
	export let id: string = getIdValue(label);

	function getIdValue(label: string | undefined): string {
		if (label === undefined) {
			return '';
		}
		return label.toLowerCase().replace(/\s+/g, '-');
	}
	export let autocomplete: string = getAutocompleteValue(label);

	export let showPassword = false;

	const togglePasswordVisibility = () => {
		showPassword = !showPassword;
	};

	const handleInput = (e: Event) => {
		value = (e.target as HTMLInputElement).value;
		if (onInput) onInput(value);
	};
</script>

<div class="group relative w-full">
	<input
		type={showPassword ? 'text' : type}
		on:input={handleInput}
		{id}
		{autocomplete}
		class="{inputClass} peer relative block w-full appearance-none !rounded-none !border-0 !border-b-2 !border-gray-300 !bg-transparent pl-6 !text-{textColor} focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-400 dark:focus:border-blue-500"
		{value}
		{name}
		{required}
		{disabled}
		{...minlength !== undefined && { minlength }}
		{...maxlength !== undefined && { maxlength }}
		{...autocomplete && { autocomplete }}
	/>

	{#if icon}
		<iconify-icon {icon} width="18" class="absolute top-3 text-{iconColor}" />
	{/if}

	{#if type === 'password'}
		<iconify-icon
			icon={showPassword ? 'bi:eye-fill' : 'bi:eye-slash-fill'}
			class={`absolute right-0 ${showPasswordBackgroundColor === 'light' ? 'text-gray-700' : 'text-gray-300'}`}
			width="24"
			on:click|preventDefault={togglePasswordVisibility}
		/>
	{/if}

	{#if label}
		<label
			for="input"
			class="{labelClass} pointer-events-none absolute left-6 transform text-sm text-gray-400 transition-all duration-200 ease-in-out peer-placeholder-shown:-top-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-left-0 peer-focus:-top-1.5 peer-focus:text-xs peer-focus:text-blue-600 {value &&
				'-left-0 -top-1.5 text-xs text-blue-600'}"
		>
			{label}
			{#if required}
				<span class="text-red-500">*</span>
			{/if}
		</label>
	{/if}
</div>

<style lang="postcss">
	div {
		min-width: 280px;
		margin: 5px;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}
</style>
