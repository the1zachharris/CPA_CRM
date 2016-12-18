'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    //crypto = require('crypto'),
    Schema = mongoose.Schema;

/**
 * subscription Schema
 */
var subscriptionSchema = new Schema({
    id: {
        type: String,
        required: 'Must have an id for the subscription',
        unique: 'id must be unique'
    },
    name: {
        type: String,
        required: 'A subscription must have a name'
    },
    description: {
        type: String
    },
    paymentSchedule: {
        type: String
    },
    interval: {
        type: String,
        required: 'Must have an interval for a subscription'
        //Contains information about the time between payments.
    },
    unit: {
        type: String,
        enum: ['months', 'days']
        //The unit of time, in association with the Interval Length, between each billing occurrence.
    },
    length: {
        type: Number,
        required: 'must define a length for this subscription'
        //The measurement of time, in association with the Interval Unit, that is used to define the frequency of the billing occurrences.
        //If the Interval Unit is "months", can be any number between 1 and 12. If the Interval Unit is "days", can be any number between 7 and 365.
    },
    totalOccurrences: {
        type: Number,
        required: 'A total number of occurrences must be specified for a subscription'
        //Number of billing occurrences or payments for the subscription.
        //To submit a subscription with no end date (an ongoing subscription), this field must be submitted with a value of 9999.
        //If a trial period is specified, this number should include the trial occurrences.
    },
    trialOccurrences: {
        type: Number
        //Number of billing occurrences or payments int he trial period.
        //If a trial period is specified, this number must be included in the total occurrences.
    },
    amount: {
        type: Number,
        required: 'an amount must be specified for this subscription'
        //The amount to be billed to the customer for each payment in the subscription.
        //If a trial period is specified, this figure is the amount that will be charged after the trial payments are complete.
    },
    trialAmount: {
        type: Number
        //The amount to be charged for each payment during the trial period.
        //Required when trialOccurrences is specified.
        //Once the number of trial occurrences is complete, the regular amount will be charged for each remaining payment.
    },
    updated: {
        type: Date
    },
    created: {
        type: Date,
        default: Date.now
    }
});


mongoose.model('subscription', subscriptionSchema);
mongoose.model('subscriptions', subscriptionSchema);