import { Schema, type InferSchemaType, Model as M } from 'mongoose';
export let roles = ['admin', 'user', 'developer'] as const;
export type Roles = (typeof roles)[number];
export let UserSchema = {
	id: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	}, // The email address of the user
	password: String, // The password of the user
	lastAuthMethod: String, // last login method was used
	role: String, // The role of the user
	username: String, // The username of the user
	lastActiveAt: Date, // The date and time when the user last accessed the application
	is_registered: Boolean // is the user registration finished
};
export let tokenSchema = {
	token: String,
	userID: String,
	expiresIn: Number
};
export let sessionSchema = {
	id: {
		type: String,
		required: true
	},
	user_id: String,
	expires: Number
};

export let mongooseUserSchema = new Schema(UserSchema, { timestamps: true });
export let mongooseSessionSchema = new Schema(sessionSchema);
export let mongooseTokenSchema = new Schema(tokenSchema, { timestamps: true });
type Modify<T, R> = Omit<T, keyof R> & R;
export type User = Modify<
	InferSchemaType<typeof mongooseUserSchema>,
	{
		id: 'string';
		role: Roles;
		lastAuthMethod: 'password' | 'token';
	}
>;
export type UserParams = ['id', 'createdAt', 'updatedAt'][number];
export type Session = InferSchemaType<typeof mongooseSessionSchema>;
export type Token = InferSchemaType<typeof mongooseTokenSchema>;
export type Cookie = {
	name: string;
	value: string;
	attributes: {
		sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
		path: string;
		httpOnly: true;
		expires: Date;
		secure: true;
	};
};
export type Model = M<any, {}, {}, {}, any, any>;
