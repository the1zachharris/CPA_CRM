'use strict';

/**
 * Module dependencies.
 */
//var mongoose = require('mongoose');



exports.fooIt = function (req, res) {
    console.log('in fooIt NOW!');
    var num1 = 1;
    var num2 = 4;
    var myresult = num1 + num2;
    return res.status(200).send({success: true, result: myresult});
};
