'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    crypto = require('crypto'),
    foo = 'TrakkTask';

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
        required: 'First Name is required'
    },
    lastName: {
        type: String,
        trim: true,
        required: 'Last Name is required'
    },
    companyName: {
        type: String,
        trim: true,
        required: 'Company Name is required'
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
    database: {
        type: String
    },
    password: {
        type: String,
        required: 'password is required'
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
    subscription: {
        refId: {
            type: String
        },
        startDate: {
            type: Date
        },
        name: {
            type: String,
            //required: 'A subscription must have a name'
        },
        description: {
            type: String
        },
        paymentSchedule: {
            type: String
        },
        interval: {
            type: String,
            //required: 'Must have an interval for a subscription'
            //Contains information about the time between payments.
        },
        unit: {
            type: String,
            enum: ['months', 'days']
            //The unit of time, in association with the Interval Length, between each billing occurrence.
        },
        length: {
            type: Number,
            //required: 'must define a length for this subscription'
            //The measurement of time, in association with the Interval Unit, that is used to define the frequency of the billing occurrences.
            //If the Interval Unit is "months", can be any number between 1 and 12. If the Interval Unit is "days", can be any number between 7 and 365.
        },
        totalOccurrences: {
            type: Number
            //Number of billing occurrences or payments for the subscription.
            //To submit a subscription with no end date (an ongoing subscription), this field must be submitted with a value of 9999.
            //If a trial period is specified, this number should include the trial occurrences.
        },
        trialOccurrences: {
            type: Number
            //Number of billing occurrences or payments int he trial period.
            //If a trial period is specified, this number must be included in the total occurrences.
        },
        amount: {
            type: Number,
            //required: 'an amount must be specified for this subscription'
            //The amount to be billed to the customer for each payment in the subscription.
            //If a trial period is specified, this figure is the amount that will be charged after the trial payments are complete.
        },
        trialAmount: {
            type: Number
            //The amount to be charged for each payment during the trial period.
            //Required when trialOccurrences is specified.
            //Once the number of trial occurrences is complete, the regular amount will be charged for each remaining payment.
        },
        status: {
            type: String,
            //required: 'Status is required',
            enum: ['Pending', 'Active', 'Expired', 'Suspended', 'Canceled', 'Terminated']
            // Active || Expired || Suspended || Canceled || Terminated
        }
    },
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
    menus: Object,
    free: {
        type: Boolean,
        default: false
    }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function(next) {
    console.log('in pre save');
    if (this.password) {
	    console.log('this.password: ' + this.password);
	    //this.salt = new Buffer(crypto.randomBytes(16).toString('base64'), 'base64');
        console.log('foo: ' + foo);
	    this.password = this.hashPassword(this.password);
	    console.log('pre save password result: ' + this.password);
	}

	next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function(password) {
    console.log('in hashPassword');
    if (foo && password) {
        console.log('foo && password: return hashed password using this.foo');
        console.log('this.foo: ' + foo);
        return crypto.createHash('sha1').update(foo + password).digest('hex');
    } else {
        return password;
    }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function(callback) {
    console.log('in authenicate');
    var checkPassword = this.password.toString();
    var hashedPassword = this.hashPassword(checkPassword).toString();
    //console.log('checkPassword: ' + checkPassword + ' hashPassword: ' + hashedPassword);
    //pull the hashed password for this user
    this.model('User').findOne({username: this.username}).exec(function (err, foundUser){
        //console.log('foundUser.password: ' + foundUser.password + ' hashPassword: ' + hashedPassword);
        //console.log('still in authenicate: ' + foundUser.password == hashedPassword);
        //this.auth = foundUser.password === hashedPassword;
        callback(foundUser.password == hashedPassword);
    });
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
