import { Model as M } from 'mongoose';
export let roles = ['admin', 'user', 'editor'] as const;
export type Roles = (typeof roles)[number];
export let UserSchema = {
	email: 'string',
	password: 'string',
	lastAuthMethod: 'string',
	role: 'string',
	username: 'string',
	is_registered: 'boolean'
};
export let tokenSchema = {
	token: 'string',
	user_id: 'ObjectId',
	expiresIn: 'number'
};
export let sessionSchema = {
	user_id: 'ObjectId',
	expires: 'number'
};

export type User = {
	id: string;
	email: string;
	password: string;
	lastAuthMethod: 'password' | 'token';
	role: Roles;
	username: string;
	is_registered: boolean;
};
export type UserParams = ['id', 'createdAt', 'updatedAt'][number];
export type Session = {
	id: string;
	user_id: string;
	expires: number;
};
export type Token = {
	id: string;
	user_id: string;
	token: string;
	expiresIn: number;
};
export type Cookie = {
	name: string;
	value: string;
	attributes: {
		sameSite: boolean | 'lax' | 'strict' | 'none' | undefined;
		path: string;
		httpOnly: true;
		expires: Date;
		secure: boolean;
	};
};
export type Model = M<any, {}, {}, {}, any, any>;
