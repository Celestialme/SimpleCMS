import mongoose from 'mongoose';
import type { Model } from './types';
import crypto from 'crypto';
function isWithinExpiration(expiresInMs: number) {
	const currentTime = Date.now();
	if (currentTime > expiresInMs) return false;
	return true;
}

export async function createToken(Token: Model, user_id: string, expiresIn: number) {
	let token = crypto.randomBytes(16).toString('hex');
	let id = new mongoose.Types.ObjectId(user_id);
	await Token.insertMany({ user_id: id, token, expiresIn: Date.now() + expiresIn });
	return token;
}

export async function validateToken(Token: Model, token: string, user_id: string) {
	let result = await Token.findOne({ user_id, token });
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
export async function consumeToken(Token: Model, token: string, user_id: string) {
	let id = new mongoose.Types.ObjectId(user_id);
	let result = await Token.findOne({ user_id: id, token });
	if (result) {
		await Token.deleteOne({ user_id: id, token });
		if (isWithinExpiration(result.expiresIn)) {
			return { status: true, message: 'token is Valid' };
		} else {
			return { status: false, message: 'token is expired' };
		}
	} else {
		return { status: false, message: 'Token does not exist' };
	}
}
