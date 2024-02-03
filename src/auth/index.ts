export const SESSION_COOKIE_NAME = 'auth_sessions';
import crypto from 'crypto';
import { consumeToken, createToken, validateToken } from './tokens';
import type { Cookie, User, UserParams, Session, Model } from './types';

export class Auth {
	private User: Model;
	private Token: Model;
	private Session: Model;

	constructor({ User, Token, Session }) {
		this.User = User;
		this.Token = Token;
		this.Session = Session;
	}
	async createUser({ email, password, username, role, lastAuthMethod, is_registered }: Omit<User, UserParams>) {
		let id = crypto.createHash('sha256').update(email).digest('hex').slice(0, 15);
		let hashed_password: string | undefined = undefined;
		if (password) hashed_password = crypto.createHash('sha256').update(password).digest('hex');
		let user = (
			await this.User.insertMany({
				id,
				email,
				password: hashed_password,
				username,
				role,
				lastAuthMethod,
				is_registered
			})
		)?.[0];
		user._id && delete user._id;
		return user as User;
	}
	async updateUserAttributes(user: User, attributes: Partial<User>) {
		if (attributes.password) attributes.password = crypto.createHash('sha256').update(attributes.password).digest('hex');
		await this.User.updateOne({ id: user.id }, { $set: attributes });
	}
	async deleteUser(id: string) {
		await this.User.deleteOne({ id });
	}
	async createSession({ user_id, expires = 60 * 60 * 1000 }: { user_id: string; expires?: number }) {
		let id = crypto
			.createHash('sha256')
			.update(user_id + new Date().getTime().toString())
			.digest('hex')
			.slice(0, 16);
		let session = (
			await this.Session.insertMany({
				id,
				user_id,
				expires: Date.now() + expires
			})
		)?.[0];

		return session as typeof session & { id: string };
	}
	async checkUser(fields: { email?: string; id?: string }): Promise<User | null>;
	async checkUser(fields: { email: string; id: string }): Promise<User | null> {
		let user = await this.User.findOne(fields);

		return user;
	}
	async getUserCount(): Promise<number> {
		return await this.User.countDocuments();
	}
	async getAllUsers(): Promise<User[]> {
		return await this.User.find({});
	}
	async destroySession(session_id: string) {
		await this.Session.deleteOne({ id: session_id });
	}
	createSessionCookie(session: Session): Cookie {
		let cookie: Cookie = {
			name: SESSION_COOKIE_NAME,
			value: session.id,
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
	async login(email: string, password: string): Promise<User | null> {
		let hashed_password = crypto.createHash('sha256').update(password).digest('hex');
		let user = await this.User.findOne({ email, password: hashed_password });

		user && delete user._id;

		return user as User;
	}
	async logOut(session_id: string) {
		await this.Session.deleteOne({ id: session_id });
	}
	async validateSession(session_id: string): Promise<User | null> {
		let resp = (
			await this.Session.aggregate([
				{
					$match: {
						id: session_id
					}
				},
				{
					$lookup: {
						from: this.User.collection.name,
						localField: 'user_id',
						foreignField: 'id',
						as: 'user'
					}
				},
				{
					$unwind: '$user'
				}
			])
		)?.[0];
		if (!resp) return null;
		resp.user._id && delete resp.user._id;
		return resp.user;
	}
	async createToken(user_id: string, expires = 60 * 60 * 1000) {
		return await createToken(this.Token, user_id, expires);
	}
	async validateToken(token: string, user_id: string) {
		return await validateToken(this.Token, token, user_id);
	}
	async consumeToken(token, user_id) {
		return await consumeToken(this.Token, token, user_id);
	}
}
