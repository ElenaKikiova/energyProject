//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Define a schema
var UserDishSchema = mongoose.Schema({
    UserId: ObjectId,
    Name: String,
    Blocks: Array
},
{ collection: "userDishes" }
);

var UserDish = mongoose.model('UserDish', UserDishSchema);

module.exports = UserDish;
