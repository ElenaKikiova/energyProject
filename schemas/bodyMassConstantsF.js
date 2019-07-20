//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Define a schema
var BodyMassConstantsFSchema = mongoose.Schema({
    Hips: Number,
    Constant: Number
},
{ collection: "bodyMassConstantsF" }
);

var BodyMassConstantsF = mongoose.model('BodyMassConstantsF', BodyMassConstantsFSchema);

module.exports = BodyMassConstantsF;
