'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    Model = mongoose.model;

/**
 * client types Schema
 */
var clienttypesSchema = new Schema ({
    id: {
      type: string
    },
    type: {
        type: string,
        required: 'Please fill in a Type for the Application',
        unique: 'Type must be unique',
        trim: true
    }
});


Model('Clienttype', clienttypesSchema);
Model('Clienttypes', clienttypesSchema);