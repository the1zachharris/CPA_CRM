'use strict';

/**
 * Module dependencies.
 */
//var mongoose = require('mongoose'),
  //  Number1 = mongoose.model('Number1');



exports.fooIt = function (req, res) {
    console.log('in fooIt NOW!');
    try {
        var num1 = req.body.num;

        var num2 = req.body.num2;
        var myresult = num1 + num2;
        return res.status(200).send({success: true, result: myresult});
    } catch(err) {
        return res.status(400).send({
            message: err
        });
    }

};
