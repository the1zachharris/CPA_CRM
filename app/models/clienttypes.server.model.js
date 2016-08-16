'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

 /**
 * client types Schema
 */
var ClienttypesSchema = new Schema ({
    id: {
        type: String,
        required: 'Must have an id for the clienttype',
        unique: 'id must be unique'
    },
    type: {
        type: String,
        required: 'Please fill in a Type for the Client',
        unique: 'Type must be unique',
        trim: true
    }
});


mongoose.model('Clienttype', ClienttypesSchema);
mongoose.model('Clienttypes', ClienttypesSchema);