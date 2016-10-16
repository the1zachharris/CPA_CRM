'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * employees Schema
 */
var employeesSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the employee',
        unique: 'id must be unique'
    },
    FirstName: {
        type: String,
        required: 'Must have an first name for the employee'
    },
    LastName: {
        type: String,
        required: 'Must have an last name for the employee'
    },
    Username: {
        type: String,
        required: 'Must have a Username for the employee',
        unique: 'Username must be unique'
    },
    Password: {
        //TODO: be sure to encrypt users passwords
        type: String,
        required: 'Must have a Password for the employee'
    },
    LastLogin: {
        type: Date
    },
    DateCreated: {
        type: Date
    }
});


mongoose.model('employee', employeesSchema);
mongoose.model('employees', employeesSchema);