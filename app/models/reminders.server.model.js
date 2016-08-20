'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * reminders Schema
 */
var remindersSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the reminder',
        unique: 'id must be unique'
    },
    Task: {
        type: String,
        required: 'Must have an task for the reminder'
    },
    Message: {
        Type: String
        //required: 'Must have an message for the reminder'
    },
    Logic: {
        type: Object,
        required: 'Must have logic for the reminder'
    }

});


mongoose.model('reminder', remindersSchema);
mongoose.model('reminders', remindersSchema);