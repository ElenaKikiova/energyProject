// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

var nodemailer = require('nodemailer');
var mail = require('./functions/mail');

// Require bcrypt for hashing passwords
const bcrypt = require('bcrypt');

// ROUTES

var User = require('../schemas/userSchema');

app.get('/forgottenPassword', function (req, res) {
    res.render("forgottenPassword");
});

app.post('/forgottenPassword', function (req, res){
    var Username = req.body.Username.trim();
    var Email = req.body.Email;

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function (err) {
        if (err) throw err;

        User.findOne({ Username: Username }, function (err, userInfo){
            if(err) throw err;
            if(userInfo != null){

                if(Email == userInfo.Email){

                    var transporter = mail.getMailTransporter();
                    var email = mail.email();

                    var mailOptions = {
                        from: email,
                        to: userInfo.Email,
                        subject: 'Забравена на парола в Energy',
                        html: '<h3>Здравейте, ' + userInfo.Username + '! Подали сте заявка за забравена парола</h3><br>' +
                        '<a href="http://energyproject.herokuapp.com/changePassword?userId=' + userInfo._id + '">Линк за задаване на нова парола </a><br>' +
                        'Към главната страница - <a href="http://energyproject.herokuapp.com">energyproject.herokuapp.com</a><br>' +
                        'Ако не сте били Вие, моля свържете се с администратор:' +
                        '<a href="mailto:' + email + '">' + email + '</a><br>' +
                        'Приятен ден!'
                    };

                    transporter.sendMail(mailOptions, function(err, info){
                        if (err) throw err;
                        else res.render("forgottenPassword", {Success: true});
                    });
                }
                else{
                    res.render("forgottenPassword", {ChangeError: "Грешен email"});
                }
            }
            else{
                res.render("forgottenPassword", {ChangeError: "Грешно потребителско име"});
            }
        });
    });
});
