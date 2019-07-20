//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Define a schema
var bodyMassConstantsMSchema = mongoose.Schema({
    Weight: Number,
    Values: Array
},
{ collection: "bodyMassConstantsM" }
);

var bodyMassConstantsM = mongoose.model('bodyMassConstantsM', bodyMassConstantsMSchema);

module.exports = bodyMassConstantsM;
