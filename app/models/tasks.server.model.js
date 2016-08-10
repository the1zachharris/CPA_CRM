'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = mongoose.model;

/**
 * tasks Schema
 */
var tasksSchema = new Schema ({

    Name: {
        type: string
    },

    Number: {
        type: number
    },

    Frequency: {
        type: string
    },

    DueDate: {
       type: date
    },

    ExtendedDueDate: {
        type: date
    },

    SecondExtendedDueDate: {
        type: date
}

});


Model('task', tasksSchema);
Model('tasks', tasksSchema);