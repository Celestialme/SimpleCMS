//lucia models

// Define the schema for the User model
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

// Sessions are how you validate and keep track of users
export let session = {
	_id: {
		type: String // session id
	},
	user_id: {
		type: String,
		required: true // reference to user(id)
	},
	active_expires: {
		type: Number,
		required: true // the expiration time (unix) of the session (active)
	},
	idle_expires: {
		type: Number,
		required: true // the expiration time (unix) for the idle period
	}
};

// The key table stores the user’s keys.
export let key = {
	_id: {
		type: String // key id in the form of: ${providerId}:${providerUserId}
	},
	user_id: {
		type: String,
		required: true // reference to user(id)
	},
	// Not strictly required by Lucia, but we'll be using it
	hashed_password: String,
	primary_key: {
		type: Boolean,
		required: true // true for primary keys
	},
	expires: {
		type: Number, // expiration for key if defined (number)
		default: null
	}
};

// Define the schema for the SignUpToken model
export let SignUpTokenSchema = {
	_id: {
		type: String // Set the type of the _id field to String
	},

	email: String, // The email address associated with the sign-up token
	role: String, // The role associated with the sign-up token
	resetRequestedAt: Date, // The date and time when the sign-up token was requested
	resetToken: String, // The sign-up token value
	expiresAt: Date // The date and time when the sign-up token expires

	// { _id: false }, // Do not automatically generate the _id field
};
