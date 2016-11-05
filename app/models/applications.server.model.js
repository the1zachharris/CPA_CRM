'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;
    //aObjectId = mongoose.Types.ObjectId;
/**
 * Application Schema
 */
var ApplicationSchema = new Schema({
	name: {
		type: String,
		required: 'Please fill in a Name for the Application',
        unique: 'Application name must be unique',
		trim: true
	},

    itpkmid: {
        type: String
    },
    description: {
        type: String
    },
    icon: {
        type: String
    },
	allRoles: {
		type: Array
	},
	allPerms: [{
        name: {
            type: String
        },
        menuItems: [{
            name: {
                type: String
            },
            icon: {
                type: String
            },
            location: {
                type: String
            }
        }]
    }],
    allMenuItems: [{
        location : {
            type: String
        },
        icon : {
            type: String
        },
        name : {
            type: String
        },
        id : {
            type: String
        },
        perm : {
            type: String
        },
        menuItemId: {
            type: Schema.Types.ObjectId
        }
    }],
    roles:[{
        name: {type: String},
        roleId: {type: Schema.Types.ObjectId},
        id: {type: String},
        perms: [{
            name:{
                type: String
            },
            menuItems: [{
                name: {
                    type: String
                },
                id: {
                    type: String
                },
                icon: {
                    type: String
                },
                location: {
                    type: String
                }
            }]
        }]
	}],
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Object,
		ref: 'User'
	},
    settings: [{
        name: {
            type: String
        },
        value: {
            type: String
        },
        info: {
            type: String
        }
    }]
});

mongoose.model('Application', ApplicationSchema);
mongoose.model('Applications', ApplicationSchema);