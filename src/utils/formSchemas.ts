import { z } from 'zod';
export let loginSchema = z.object({
	email: z.string().email(),
	password: z.string().min(4),
	isToken: z.boolean()
});
export type LoginSchema = z.infer<typeof loginSchema>;
export let recoverSchema = z.object({
	email: z.string().email()
});
export type RecoverSchema = z.infer<typeof recoverSchema>;

export let signUpSchema_token = z
	.object({
		email: z.string().email(),
		password: z.string().min(4),
		confirmPassword: z.string().min(4),
		username: z.string().min(3),
		token: z.string().min(16)
	})

	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
export let signUpSchema_noToken = signUpSchema_token
	.innerType()
	.omit({ token: true })
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
export type SignupSchema = z.infer<typeof signUpSchema_noToken | typeof signUpSchema_token>;
export let addUserSchema = z.object({
	email: z.string().email(),
	role: z.string()
});
export type AddUserSchema = z.infer<typeof addUserSchema>;
export let changePasswordSchema = z
	.object({
		password: z.string().min(4),
		confirmPassword: z.string().min(4)
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: 'Passwords do not match',
		path: ['confirmPassword']
	});
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
