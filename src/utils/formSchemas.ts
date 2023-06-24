import { z } from 'zod';
import { get } from 'svelte/store';
import LL from '@src/i18n/i18n-svelte.js';

// SignIN Schemas
export let loginFormSchema = z.object({
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
	password: z.string({ required_error: 'Password is required' }).min(4)
});

// TODO: Check if this schema grabs
export let forgotFormSchema = z.object({
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' })
});

// TODO: Check if this schema grabs
export let resetFormSchema = z.object({
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
	token: z.string({ required_error: get(LL).LOGIN_ZOD_Token_string() }).min(1),
	password: z
		.string({ required_error: get(LL).LOGIN_ZOD_Password_string() })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
			message: get(LL).LOGIN_ZOD_Password_regex()
		}),
	confirm_password: z
		.string({ required_error: get(LL).LOGIN_ZOD_Confirm_password_string() })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
			message: get(LL).LOGIN_ZOD_Confirm_password_regex()
		})
});

//TODO: fix TOKEN for other user than first
export let signUpFormSchema = z.object({
	username: z
		.string({ required_error: get(LL).LOGIN_ZOD_Username_string() })
		.regex(/^[a-zA-Z0-9@$!%*#]+$/, { message: get(LL).LOGIN_ZOD_Username_regex() })
		.min(2, { message: get(LL).LOGIN_ZOD_Username_min() })
		.max(24, { message: get(LL).LOGIN_ZOD_Username_max() })
		.trim(),
	email: z.string({ required_error: get(LL).LOGIN_ZOD_Email_string() }).email({ message: get(LL).LOGIN_ZOD_Email_email() }),
	password: z
		.string({ required_error: get(LL).LOGIN_ZOD_Password_string() })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
			message: get(LL).LOGIN_ZOD_Password_regex()
		}),
	confirm_password: z
		.string({ required_error: get(LL).LOGIN_ZOD_Confirm_password_string() })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
			message: get(LL).LOGIN_ZOD_Confirm_password_regex()
		})
	// .refine((val: string, ctx) => val === ctx.parent.password, {
	// 	message: 'Passwords must match'
	// }),
	// terms: z.boolean({ required_error: 'Confirm Terms' })
});

//TODO: fix TOKEN for other user than first
export let signUpOtherFormSchema = z.object({
	username: z
		.string({ required_error: get(LL).LOGIN_ZOD_Username_string() })
		.regex(/^[a-zA-Z0-9@$!%*#]+$/, { message: get(LL).LOGIN_ZOD_Username_regex() })
		.min(2, { message: get(LL).LOGIN_ZOD_Username_min() })
		.max(24, { message: get(LL).LOGIN_ZOD_Username_max() })
		.trim(),
	email: z.string({ required_error: get(LL).LOGIN_ZOD_Email_string() }).email({ message: get(LL).LOGIN_ZOD_Email_email() }),
	password: z
		.string({ required_error: get(LL).LOGIN_ZOD_Password_string() })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
			message: get(LL).LOGIN_ZOD_Password_regex()
		}),
	confirm_password: z
		.string({ required_error: get(LL).LOGIN_ZOD_Confirm_password_string() })
		.regex(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/, {
			message: get(LL).LOGIN_ZOD_Confirm_password_regex()
		}),
	// .refine((val: string, ctx) => val === ctx.parent.password, {
	// 	message: 'Passwords must match'
	// }),
	isToken: z.boolean()
	//token: z.string({ required_error: get(LL).LOGIN_ZOD_Token_string() }).min(1)
	// terms: z.boolean({ required_error: 'Confirm Terms' })
});

export let addUserSchema = z.object({
	email: z.string().email(),
	role: z.string(),
	expiresIn: z.string()
});
