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
      type: String
    },
    type: {
        type: String,
        required: 'Please fill in a Type for the Application',
        unique: 'Type must be unique',
        trim: true
    }
});


mongoose.model('Clienttype', ClienttypesSchema);
mongoose.model('Clienttypes', ClienttypesSchema);