//Require Mongoose
var mongoose = require('mongoose');

// Require bcrypt for hashing passwords
const bcrypt = require('bcrypt');
const saltRounds = 12;

//Define a schema
var UserSchema = mongoose.Schema({
    Username: String,
    Password: String,
    Email: String,
    Gender: String,
    BlocksPerDay: Number,
    RegisterDate: Date,
    LastEntry: Date,
    Status: String
},
{ collection: "users" }
);

// Hash password before user is saved to database
UserSchema.pre('save', function (next) {
    var user = this;
    bcrypt.hash(user.Password, saltRounds, function (err, hash){
        if (err) {
            return next(err);
        }
        user.Password = hash;
        next();
    })
});

var User = mongoose.model('User', UserSchema);

module.exports = User;
