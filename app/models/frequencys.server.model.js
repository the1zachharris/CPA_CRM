'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * frequency Schema
 */
var frequencySchema = new Schema({
    Frequency: {
        type: string
    },
    pattern: {
        type: boolean
    }
});


mongoose.model('frequency', frequencySchema);
mongoose.model('frequencys', frequencySchema);