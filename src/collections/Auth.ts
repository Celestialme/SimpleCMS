export let user = {
	_id: {
		type: String
	},
	username: String,
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
	primary: {
		type: Boolean,
		required: true
	}
};
