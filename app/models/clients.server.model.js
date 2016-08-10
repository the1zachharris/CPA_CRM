'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = mongoose.model;

/**
 * clients Schema
 */
var clientSchema = new Schema ({
    Name: {
        type: string
    },

    Address1: {
        type: string
    },

    Address2: {
        type: string
    },

    City: {
        type: string
    },

    StateProvince: {
        type: string
    },

    PostalCode: {
        type: string
    },

    Country: {
        type: string
    },

    Phone: {
        type: string
    },

    email: {
        type: string
    },

    Contacts: {
        type: array
    },

    ResponsibleEmployee: {
        type: string
    },

    type: {
        type: string
    },

    DateCreated: {
        type: date
    },

    DateUpdated: {
        type: date
    },

    Tasks: {
        type: array
    }

});


Model('Client', clientSchema);
Model('Clients', clientSchema);