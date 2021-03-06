'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * clients Schema
 */
var clientSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the client',
        unique: 'id must be unique'
    },
    Name: {
        type: String
    },
    Address1: {
        type: String
    },
    Address2: {
        type: String
    },
    City: {
        type: String
    },
    StateProvince: {
        type: String
    },
    PostalCode: {
        type: String
    },
    Country: {
        type: String
    },
    Phone: {
        type: String
    },
    Email: {
        type: String
    },
    Contacts: {
        type: Array
    },
    ResponsibleEmployee: {
        type: Object
    },
    Type: {
        type: String
    },
    DateCreated: {
        type: Date
    },
    DateUpdated: {
        type: Date
    },
    Tasks: {
        type: Array
    }
});


mongoose.model('client', clientSchema);
mongoose.model('clients', clientSchema);