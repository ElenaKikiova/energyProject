//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Define a schema
var UserIngredientSchema = mongoose.Schema({
    UserId: ObjectId,
    Name: String,
    Type: String,
    Value: Number
},
{ collection: "userIngredients" }
);

var UserIngredient = mongoose.model('UserIngredient', UserIngredientSchema);

module.exports = UserIngredient;
