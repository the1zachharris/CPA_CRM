'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * tasks Schema
 */
var tasksSchema = new Schema ({

    Name: {
        type: String
    },

    Number: {
        type: String
    },

    Frequency: {
        type: String
    },

    DueDate: {
       type: Date
    },

    ExtendedDueDate: {
        type: Date
    },

    SecondExtendedDueDate: {
        type: Date
}

});


mongoose.model('task', tasksSchema);
mongoose.model('tasks', tasksSchema);