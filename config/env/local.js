'use strict';
var mongoose = require('mongoose');

module.exports = {

///// Mongo /////
    db: 'mongodb://localhost/',
    dbname: 'trakktask',
    port:3000,
    app: {
        title: 'local: TrakkTask'
    },
    mongoIndexTimezoneOffset: '0',
    //// Logging Level /////
    defaultLoggingLevel: 'DEBUG',
    ////// Misc //////
    mailer: {
        from: process.env.MAILER_FROM || 'MAILER_FROM',
        options: {
            service: process.env.MAILER_SERVICE_PROVIDER || 'MAILER_SERVICE_PROVIDER',
            auth: {
                user: process.env.MAILER_EMAIL_ID || 'MAILER_EMAIL_ID',
                pass: process.env.MAILER_PASSWORD || 'MAILER_PASSWORD'
            }
        }
    },
    // Authorize.net vars
    apiLoginKey: '87zYp6PSh',
    transactionKey: '2bg9x3u2q9XV72PD'
};

// Call the console.log function.
console.log('Hello Local Host!');