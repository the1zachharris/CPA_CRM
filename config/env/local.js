'use strict';
var mongoose = require('mongoose');

module.exports = {

///// Mongo /////
    db: 'mongodb://localhost/cpa_crm',
    dbname: 'cpa_crm',
    port:3000,
    app: {
        title: 'local: CPA_CRM'
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
    }
};

// Call the console.log function.
console.log('Hello Local Host!');