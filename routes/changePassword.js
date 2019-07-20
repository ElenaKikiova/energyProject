// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;
var getUserCookie = require('./functions/getUserCookie');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

var nodemailer = require('nodemailer');
var mail = require('./functions/mail');

// Require bcrypt for hashing passwords
const bcrypt = require('bcrypt');

// ROUTES

var User = require('../schemas/userSchema');

app.get('/changePassword', function (req, res) {

    var idCookie;
    var usernameCookie;

    if(req.query.userId == null){
        usernameCookie = getUserCookie("username", req);
        idCookie = getUserCookie("id", req);
    }
    else{
        // If link came from email
        idCookie = req.query.userId;
    }
    console.log(idCookie, typeof idCookie);

    if(typeof idCookie != "undefined"){
        res.render("changePassword", {userId: idCookie, username: usernameCookie});
    }
    else{
        res.redirect('login?error=ExpiredSession');
    }
});


app.post('/changePassword', function (req, res){
    var Password = req.body.Password.trim();
    var Email = req.body.Email;
    var idCookie = req.body.idCookie;

    if(idCookie.length > 0){

        mongoose.connect(baseUrl, { useNewUrlParser: true }, function (err) {
            if (err) throw err;
            User.findOne({ _id: ObjectId(idCookie) }, function (err, userInfo){
                if(err) throw err;
                if(userInfo != null){
                    if(Email == userInfo.Email){
                        userInfo.Password = Password;
                        userInfo.save(function(err){ if(err) throw err; });

                        var transporter = mail.getMailTransporter();
                        var email = mail.email();

                        var mailOptions = {
                            from: email,
                            to: userInfo.Email,
                            subject: 'Промяна на парола в Energy',
                            html: '<h3>Здравейте, ' + userInfo.Username + '! Промяната на паролата Ви в Energy е успешна</h3><br>' +
                            'Към главната страница - <a href="http://energyproject.herokuapp.com">energyproject.herokuapp.com</a><br>' +
                            'Ако не сте били Вие, моля свържете се с администратор:' +
                            '<a href="mailto:' + email + '">' + email + '</a><br>' +
                            'Приятен ден!'
                        };

                        transporter.sendMail(mailOptions, function(err, info){
                            if (err) throw err;
                            else console.log('Email sent: ' + info.response);
                        });

                        res.render("changePassword", {Success: true});
                    }
                    else{
                        res.render("changePassword", {ChangeError: "Грешен email"});
                    }
                }
                else{
                    res.render("changePassword", {ChangeError: "Потребител с такъв ID не съществува"});
                }
            });
        });
    }
    else{
        res.render("changePassword", {ChangeError: "Сесията за промяна на парола изтече"});
    }
});
