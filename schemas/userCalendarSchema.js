//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Define a schema
var UserCalendarSchema = mongoose.Schema({
    UserId: ObjectId,
    Year: Number,
    Month: Number,
    Day: Number,
    Date: String,
    Blocks: Number,
    Details: Array
},
{ collection: "userCalendar" }
);

var UserCalendar = mongoose.model('UserCalendar', UserCalendarSchema);

module.exports = UserCalendar;
