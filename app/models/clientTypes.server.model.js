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
    Type: {
        type: string
    }
});


Model('Clienttype', clienttypesSchema);
Model('Clienttypes', clienttypesSchema);