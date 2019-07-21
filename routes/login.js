// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

// Require bcrypt for hashing passwords
const bcrypt = require('bcrypt');

// ROUTES

var User = require('../schemas/userSchema');

app.get('/login', function (req, res) {
    var error = req.query.error;

    if(error == "NoPermission"){
        res.render('login', {AdminError: "Нямате право за достъп до този URL"});
    }
    else if(error == "ExpiredSession"){
        res.render('login', {SessionError: "За достъп до тази страница трябва да влезете в системата на Energy"});
    }
    else res.render('login');
});

app.post('/login', function (req, res){

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function (err) {
        if (err) throw err;

        User.findOne({ Username: req.body.username }, function (err, user){

            if(user == null) res.render("login", {message: "Не съществува такъв потребител"});
            else{
                bcrypt.compare(req.body.password, user.Password, function (err, result) {
                    if (result) {

                        var hour = 3600000;
                        var redirectUrl = "profile";

                        if(user.Status == "Administrator"){
                            res.cookie('EnergyAdminId', user._id, {maxAge: 14*24*hour}); // 2 weeks
                            redirectUrl = "admin";
                        }
                        else {
                            res.cookie('EnergyUsername', user.Username, {maxAge: 14*24*hour}); // 2 weeks
                            res.cookie('EnergyUserId', user._id, {maxAge: 14*24*hour}); // 2 weeks
                        }
                        

                        user.set("LastEntry", new Date());

                        res.redirect(redirectUrl);

                    } else {
                        res.render("login", {message: "Грешна парола"});
                    }
                });
            }
        });
    });
});
