import type { InferSchemaType } from 'mongoose';
import { Schema } from 'mongoose';
import type { roles } from './types';

export let session = {
	_id: {
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true
	},
	active_expires: {
		type: Number,
		required: true
	},
	idle_expires: {
		type: Number,
		required: true
	}
};
export let session2 = {
	user_id: Schema.ObjectId,
	expires: Number
};
export let key = {
	_id: {
		type: String,
		required: true
	},
	user_id: {
		type: String,
		required: true
	},
	hashed_password: String
};

export let UserSchema = {
	_id: {
		type: String,
		required: true // Set the type of the _id field to String
	},
	authMethod: String, // last login method was used
	email: String, // The email address of the user
	role: String, // The role of the user
	username: String, // The username of the user
	firstname: String, // The first name of the user
	lastname: String, // The last name of the user
	avatar: String, // The avatar of the user
	resetRequestedAt: String, // The date and time when a password reset was requested
	resetToken: String, // The password reset token value
	expiresAt: Date, // The date and time when the password reset token expires
	lastActiveAt: Date // The date and time when the user last accessed the application
};
export let UserSchema2 = {
	password: String, // The password of the user
	lastAuthMethod: String, // last login method was used
	email: String, // The email address of the user
	role: String, // The role of the user
	username: String, // The username of the user
	firstname: String, // The first name of the user
	lastname: String, // The last name of the user
	avatar: String, // The avatar of the user
	resetRequestedAt: String, // The date and time when a password reset was requested
	resetToken: String, // The password reset token value
	expiresAt: Date, // The date and time when the password reset token expires
	lastActiveAt: Date, // The date and time when the user last accessed the application
	is_registered: Boolean // is the user registration finished
};
export let TokenSchema = {
	token: String,
	userID: String,
	expiresIn: Number
};
type Modify<T, R> = Omit<T, keyof R> & R;
let mongooseUserSchema = new Schema(UserSchema);
export type User = Modify<
	InferSchemaType<typeof mongooseUserSchema>,
	{
		id: string;
		role: (typeof roles)[number];
		authMethod: 'password' | 'token';
	}
>;
