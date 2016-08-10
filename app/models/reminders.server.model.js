'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = mongoose.model;

/**
 * reminders Schema
 */
var remindersSchema = new Schema ({

    task: {
        type: string
    },

    Message: {
        Type: string
    },

    Logic: {
        type: object
    }

});


Model('reminder', remindersSchema);
Model('reminders', remindersSchema);