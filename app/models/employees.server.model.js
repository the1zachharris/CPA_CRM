'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = mongoose.model;

/**
 * employees Schema
 */
var employeesSchema = new Schema ({

    FirstName: {
        type: string
    },

    LastName: {
        type: string
    },

    Username: {
        type: string
    },

    Password: {
        type: string
    },

    LastLogin: {
        type: date
    },

    DateCreated: {
        type: date
    }

});


Model('employee', employeesSchema);
Model('employees', employeesSchema);