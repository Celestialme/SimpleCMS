<script lang="ts">
	import { validateZod } from '@src/utils/utils';
	import { z } from 'zod';
	let inputSchema = z.object({
		email: z.string().email().min(5)
	});

	let value = '';

	$: errors = validateZod(inputSchema, { email: value });
</script>

<input type="text" bind:value />
{#if errors && errors.email}
	<pre>{errors.email}</pre>
{/if}
