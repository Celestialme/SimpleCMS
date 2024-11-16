export const SESSION_COOKIE_NAME = 'auth_sessions';
import crypto from 'crypto';
import type { Cookie, User, UserParams, Session, Model, Token } from './types';
import mongoose from 'mongoose';

export class Auth {
	private User: Model;
	private Token: Model;
	private Session: Model;

	private users: User[] = [];
	private sessions: Session[] = [];
	private tokens: Token[] = [];

	constructor({ User, Token, Session }) {
		this.User = User;
		this.Token = Token;
		this.Session = Session;
		(async () => {
			this.users = (await User.find({}).lean()).map(({ _id, ...user }) => ({
				...user,
				id: _id.toString()
			}));
			this.sessions = (await Session.find({}).lean()).map(({ _id, ...session }) => ({
				...session,
				user_id: session.user_id.toString(),
				id: _id.toString()
			}));
			this.tokens = (await Token.find({}).lean()).map(({ _id, ...token }) => ({
				...token,
				user_id: token.user_id.toString(),
				id: _id.toString()
			}));
		})();
	}
	async createUser({
		email,
		password,
		username,
		role,
		lastAuthMethod,
		is_registered
	}: Omit<User, UserParams>) {
		let hashed_password: string | undefined = undefined;
		if (password) hashed_password = crypto.createHash('sha256').update(password).digest('hex');
		let user = (
			await this.User.insertMany(
				{
					email,
					password: hashed_password,
					username,
					role,
					lastAuthMethod,
					is_registered
				},
				{ lean: true }
			)
		).map(({ _id, ...user }) => ({ ...user, id: _id.toString() }) as User)[0];
		this.users.push(user);
		return user as User;
	}
	async updateUserAttributes(user: User, attributes: Partial<User>) {
		if (attributes.password)
			attributes.password = crypto.createHash('sha256').update(attributes.password).digest('hex');

		this.users = this.users.map((u) => (u.id === user.id ? { ...u, ...attributes } : u));
		return await this.User.updateOne({ _id: user.id }, { $set: attributes });
	}
	async deleteUser(id: string) {
		this.users = this.users.filter((user) => user.id !== id);
		await this.User.deleteOne({ _id: id });
	}
	async createSession({
		user_id,
		expires = 60 * 60 * 1000
	}: {
		user_id: string;
		expires?: number;
	}) {
		let session = (
			await this.Session.insertMany(
				{
					user_id: new mongoose.Types.ObjectId(user_id),
					expires: Date.now() + expires
				},
				{ lean: true }
			)
		).map(
			({ _id, ...session }) =>
				({ ...session, user_id: session.user_id.toString(), id: _id.toString() }) as Session
		)[0];
		this.sessions.push(session);
		return session;
	}
	checkUser(fields: { email?: string; _id?: string }): User | null;
	checkUser(fields: { email: string; _id: string }): User | null {
		let user = this.users.find((user) => user.email === fields.email || user.id === fields._id);

		return user || null;
	}
	getUserCount(): number {
		return this.users.length;
	}
	getAllUsers(): User[] {
		return this.users;
	}
	async destroySession(session_id: string) {
		this.sessions = this.sessions.filter((session) => session.id !== session_id);
		await this.Session.deleteOne({ _id: session_id });
	}
	createSessionCookie(session: Session): Cookie {
		let cookie: Cookie = {
			name: SESSION_COOKIE_NAME,
			value: session.id as string,
			attributes: {
				sameSite: 'lax',
				path: '/',
				httpOnly: true,
				expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
				secure: false
			}
		};

		return cookie;
	}
	login(email: string, password: string): User | null {
		let hashed_password = crypto.createHash('sha256').update(password).digest('hex');
		let user = this.users.find((user) => user.email === email && user.password === hashed_password);
		return user as User;
	}
	async logOut(session_id: string) {
		await this.destroySession(session_id);
	}
	validateSession(session_id: string): User | null {
		if (!session_id) return null;
		let session = this.sessions.find((session) => session.id === session_id);
		if (!session) return null;
		let user = this.users.find((user) => user.id === session.user_id);
		if (!user) return null;
		return user;
	}

	async createToken(user_id: string, expires = 60 * 60 * 1000) {
		let token = crypto.randomBytes(16).toString('hex');
		let id = new mongoose.Types.ObjectId(user_id);
		let result = (
			await this.Token.insertMany(
				{ user_id: id, token, expiresIn: Date.now() + expires },
				{ lean: true }
			)
		).map(
			({ _id, ...token }) =>
				({ ...token, user_id: token.user_id.toString(), id: _id.toString() }) as Token
		)[0];
		this.tokens.push(result);

		return token;
	}
	async validateToken(token: string, user_id: string) {
		let result = this.tokens.find((_token) => _token.token === token && _token.user_id === user_id);
		console.log(result);
		if (result) {
			if (isWithinExpiration(result.expiresIn)) {
				return { success: true, message: 'token is Valid' };
			} else {
				return { success: false, message: 'token is expired' };
			}
		} else {
			return { success: false, message: 'Token does not exist' };
		}
	}
	async consumeToken(token: string, user_id: string) {
		let result = this.tokens.find((_token) => _token.token === token && _token.user_id === user_id);
		if (result) {
			await this.Token.deleteOne({ user_id, token });
			this.tokens = this.tokens.filter((token) => token.token !== result.token);
			if (isWithinExpiration(result.expiresIn)) {
				return { status: true, message: 'token is Valid' };
			} else {
				return { status: false, message: 'token is expired' };
			}
		} else {
			return { status: false, message: 'Token does not exist' };
		}
	}
}
function isWithinExpiration(expiresInMs: number) {
	const currentTime = Date.now();
	if (currentTime > expiresInMs) return false;
	return true;
}
