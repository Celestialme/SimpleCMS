import { UserSchema2 } from '@src/collections/Auth';
import type { roles } from '@src/collections/types';
import { type Model, Types, type InferSchemaType, Schema } from 'mongoose';
const SESSION_COOKIE_NAME = 'auth_sessions2';
let mongooseUserSchema = new Schema(UserSchema2);
type Modify<T, R> = Omit<T, keyof R> & R;
type User = Modify<
	InferSchemaType<typeof mongooseUserSchema>,
	{
		id: string;
		role: (typeof roles)[number];
		authMethod: 'password' | 'token';
	}
>;
export class Auth {
	private User: Model<any, {}, {}, {}, any, any>;
	// private Token: Model<any, {}, {}, {}, any, any>;
	private Session: Model<any, {}, {}, {}, any, any>;

	constructor({ User, Session }) {
		console.log(User.insertMany);
		this.User = User;
		// this.Token = Token;
		this.Session = Session;
	}
	async createUser({ email, password, username, role, lastAuthMethod, is_registered }) {
		let user = (
			await this.User.insertMany({
				email,
				password,
				username,
				role,
				lastAuthMethod,
				is_registered
			})
		)?.[0];
		return user as typeof user & { _id: typeof Types.ObjectId; id: string };
	}
	async updateUserAttributes(user, attributes: Partial<User>) {
		await this.User.updateOne({ _id: user._id }, { $set: attributes });
	}
	async deleteUser(id: string) {
		console.log(id);
		await this.User.deleteOne({ _id: new Types.ObjectId(id) });
	}
	async createSession({ user_id, expires = 60 * 60 * 1000 }) {
		console.log(user_id);
		let session = (
			await this.Session.insertMany({
				user_id,
				expires: Date.now() + expires
			})
		)?.[0];

		return session as typeof session & { _id: typeof Types.ObjectId; id: string };
	}
	createSessionCookie(session: { _id: typeof Types.ObjectId }) {
		let cookie = {
			name: SESSION_COOKIE_NAME,
			value: session._id.toString(),
			attributes: {
				sameSite: 'lax',
				path: '/',
				httpOnly: true,
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
				secure: true
			}
		};

		return cookie;
	}
	async login(email: string, password: string) {
		let user = (await this.User.findOne({ email, password })) as User;
		return user as typeof user & { _id: typeof Types.ObjectId; id: string };
	}
	async validateSession(session) {
		let resp = (
			await this.Session.aggregate([
				{
					$match: {
						_id: session._id
					}
				},
				{
					$lookup: {
						from: 'auth_users2',
						localField: 'user_id',
						foreignField: '_id',
						as: 'user'
					}
				},
				{
					$unwind: '$user'
				}
			])
		)?.[0];
		if (!resp) return { user: {} as User, status: 404 };
		return { user: resp.user as User, status: 200 };
	}
}
