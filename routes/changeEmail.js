// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;
var getUserCookie = require('./functions/getUserCookie');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

// Require bcrypt for hashing passwords
const bcrypt = require('bcrypt');

// ROUTES

var User = require('../schemas/userSchema');

app.get('/changeEmail', function (req, res) {


    res.redirect('/oups');
    var usernameCookie = getUserCookie("username", req);
    var idCookie = getUserCookie("id", req);

    if(typeof idCookie != "undefined"){
        res.render("changeEmail", {userId: idCookie, username: usernameCookie});
    }
    else{
        res.redirect('login?error=ExpiredSession');
    }
});

app.post('/changeEmail', function (req, res){
    var Password = req.body.Password.trim();
    var Email = req.body.Email;
    var idCookie = getUserCookie("id", req);

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function (err) {
        if (err) throw err;

        User.findOne({ _id: ObjectId(idCookie) }, function (err, userInfo){
            if(err) throw err;
            bcrypt.compare(Password, userInfo.Password, function (err, result) {
                if (result === true) {

                    userInfo.Email = Email;
                    userInfo.save(function(err){ if(err) throw err});
                    res.render("changeEmail", {Success: true});
                }
                else{
                    res.render("changeEmail", {ChangeError: "Грешна парола"});
                }
            });

        });
    });
});
