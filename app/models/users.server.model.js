'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function(property) {
    //return ((this.provider !== 'local' && !this.updated) || property.length);
    return true;
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
    //return (this.provider !== 'local' || (password && password.length > 6));
    return true;
};

/**
 * User Schema
 */
var UserSchema = new Schema({
    firstName: {
        type: String,
        trim: true,
        default: ''//,
        //validate: [validateLocalStrategyProperty, 'Please fill in your first name']
    },
    lastName: {
        type: String,
        trim: true,
        default: ''//,
        //validate: [validateLocalStrategyProperty, 'Please fill in your last name']
    },
    companyName: {
        type: String,
        trim: true,
        required: 'Please fill in a Company Name'
    },
    displayName: {
        type: String,
        trim: true,
        required: 'Display Name is required'
    },
    address: {
        address1: {
            type: String
        },
        address2: {
            type: String
        },
        city: {
            type: String
        },
        country: {
            type: String
        },
        state: {
            type: String
        },
        postalCode: {
            type: String
        }
    },
    email: {
        type: String,
        trim: true,
        required: 'Email address is required',
        unique: 'There is already an account associated with that email address.',
        //validate: [validateLocalStrategyProperty, 'Please fill in your email'],
        match: [/.+\@.+\..+/, 'Please fill a valid email address']
    },
    phone: {
        type: String
    },
    username: {
        type: String,
        unique: 'username must be unique',
        required: 'Please fill in a username',
        trim: true
    },
    password: {
        type: String,
        required: 'Please fill in a password',
        trim: true
    },
    roles: [{
        id: {
            type: String
        },
        name: {
            type: String
        },
        appName:{
            type: String
        },
        perms: [{
            name: {
                type: String
            },
            permId: {
                type: String
            }
        }]
    }],
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    },
    /* For reset password */
    resetPasswordToken: {
        type: String
    },
    resetPasswordExpires: {
        type: Date
    },
    loginTime:{
        type: Date,
        default: Date.now
    },
    menus: Object
});

/**
 * Hook a pre save method to hash the password
 */
//UserSchema.pre('save', function(next) {
//	if (this.password && this.password.length > 6) {
//		this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
//		this.password = this.hashPassword(this.password);
//	}

//	next();
//});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    if (this.salt && password) {
        return crypto.pbkdf2Sync(password, this.salt, 10000, 64).toString('base64');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(password) {
    return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function(username, suffix, callback) {
    var _this = this;
    var possibleUsername = username + (suffix || '');

    _this.findOne({
        username: possibleUsername
    }, function(err, user) {
        if (!err) {
            if (!user) {
                callback(possibleUsername);
            } else {
                return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
            }
        } else {
            callback(null);
        }
    });
};

mongoose.model('User', UserSchema);
mongoose.model('Users', UserSchema);
