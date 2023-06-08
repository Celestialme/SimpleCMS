import { z } from 'zod';
import { get } from 'svelte/store';
import LL from '@src/i18n/i18n-svelte.js';

export let loginSchema = z.object({
	email: z.string({ required_error: 'Email is required' }).email({ message: 'Invalid email address' }),
	password: z.string({ required_error: 'Password is required' }).min(4)
});

//TODO: fix TOKEN for other user than first
export let signUpSchema = z.object({
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
	//token: z.string({ required_error: get(LL).LOGIN_ZOD_Token_string() }).min(1)
	// terms: z.boolean({ required_error: 'Confirm Terms' })
});