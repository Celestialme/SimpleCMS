export let user = {
	_id: {
		type: String
	},
	username: String
};

export let session = {
	_id: {
		type: String
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

export let key = {
	_id: {
		type: String
	},
	user_id: {
		type: String,
		required: true
	},
	hashed_password: String,
	primary_key: {
		type: Boolean,
		required: true
	},
	expires: {
		type: Number,
		default: null
	}
};

export let UserSchema = {
	_id: {
		type: String // Set the type of the _id field to String
	},
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
