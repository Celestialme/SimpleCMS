import { z } from 'zod';
export let loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4)
});
export let signUpSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4)
});
