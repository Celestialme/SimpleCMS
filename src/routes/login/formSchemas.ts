import { z } from 'zod';
export let loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4)
});
export let recoverSchema = z.object({
	email: z.string().email()
});
export let signUpSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(4),
		confirmPassword: z.string().min(4)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
