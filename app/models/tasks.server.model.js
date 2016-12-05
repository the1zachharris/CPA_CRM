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
    id: {
        type: String,
        required: 'Must have an id for the task',
        unique: 'id must be unique'
    },
    Name: {
        type: String,
        required: 'Please fill in a name for the Task',
        unique: 'Task name must be unique',
        trim: true
    },
    Frequency: {
        type: String,
        required: 'Please fill in a frequency for the Task',
        trim: true
    },
    DueDate: {
       type: Date,
        required: 'Please fill in a due date for the Task',
        trim: true
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
mongoose.model('Task', tasksSchema);
mongoose.model('Tasks', tasksSchema);