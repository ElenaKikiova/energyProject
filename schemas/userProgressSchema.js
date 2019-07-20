//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Define a schema
var UserProgressSchema = mongoose.Schema({
    UserId: ObjectId,
    Date: String,
    Weight: Number,
    FatBodyMassPercentage: Number
},
{ collection: "userProgress" }
);

var UserProgress = mongoose.model('UserProgress', UserProgressSchema);

module.exports = UserProgress;
