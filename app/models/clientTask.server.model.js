'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * clients Schema
 */
var clientTaskSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the clientTask',
        unique: 'id must be unique'
    },
    clientid: {
        type: String
    },
    clientName: {
        type: String
    },
    taskid: {
        type: String
    },
    taskName: {
        type: String
    },
    taskDueDate: {
        type: Date
    },
    taskExtendedDueDate: {
        type: Date
    },
    taskSecondExtendedDueDate: {
        type: String
    },
    taskStatus: {
        type: String
    },
    taskCompletedDate: {
        type: Date
    },
    taskCreatedDate: {
        type: Date
    },
    taskExtendedDate: {
        type: Date
    },
    taskReceivedDate: {
        type: Date
    },
    taskEmployeeid: {
        type: String
    },
    taskFrequency: {
        type: String
    }
});


mongoose.model('clientTask', clientTaskSchema);
mongoose.model('clientTasks', clientTaskSchema);