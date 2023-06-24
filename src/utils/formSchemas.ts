import { z } from 'zod';
export let loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
	isToken: z.boolean()
});
export let recoverSchema = z.object({
	email: z.string().email()
});

export let signUpSchema = z
	.object({
		email: z.string().email(),
		password: z.string().min(4),
		confirmPassword: z.string().min(4),
		token: z.string().min(16)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});

export let addUserSchema = z.object({
	email: z.string().email(),
	role: z.string()
});
