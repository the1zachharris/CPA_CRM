'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    crypto = require('crypto'),
    Schema = mongoose.Schema;

/**
 * frequency Schema
 */
var frequencySchema = new Schema({
    id: {
        type: String,
        required: 'Must have an id for the frequency',
        unique: 'id must be unique'
    },
    frequency: {
        type: String,
        required: 'Must have an frequency',
        unique: 'frequency must be unique'
    }
});


mongoose.model('Frequency', frequencySchema);
mongoose.model('Frequencies', frequencySchema);