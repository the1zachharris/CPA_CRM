'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * reminders Schema
 */
var provincesSchema = new Schema ({
    name: {
        type: String
    },
    short: {
        type: String
    },
    alt: {
        Type: Array
    },
    country: {
        type: String,
        required: 'Must have Country for this province'
    },
    region: {
        type: String
    },
    english: {
        type: String
    }
});


mongoose.model('province', provincesSchema);
mongoose.model('provinces', provincesSchema);