const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const UserSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
		trim: true
	},
	name: {
		type: String,
		required: true,
		trim: true
	},
	favoriteBook: {
		type: String,
		required: true,
		trim: true
	},
	password: {
		type: String,
		required: true
	}
});

// Authenticate input against database documents
UserSchema.statics.authenticate = (email, password, callback) => {
	User.findOne({email: email})
		.exec((error, user) => {
			if (error) {
				return callback(error);
			} else if ( !user ) {
				let err = new Error('User not Found');
				err.status = 401;
				return callback(err);
			}
			bcrypt.compare(password, user.password, (error, result) => {
				if (result === true) {
					return callback(null, user);
				} else {
					return callback();
				}
			});
		});
};

// Hash password before saving to database
UserSchema.pre('save', function(next) {
	let user = this;
	bcrypt.hash(user.password, 10, function(err, hash) {
		if (err) {
			return next(err);
		}
		user.password = hash;
		next();
	})
});
const User = mongoose.model('User', UserSchema);
module.exports = User;























