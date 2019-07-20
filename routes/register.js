// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

var nodemailer = require('nodemailer');
var mail = require('./functions/mail');

// ROUTES

var User = require('../schemas/userSchema');

app.get('/register', function (req, res) {
    res.render('register');
});

app.post('/register', function (req, res){

    var UserRegInfo = req.body.userInfo;


    console.log("register");
    mongoose.connect(baseUrl, { useNewUrlParser: true }, function (err) {
        if (err) {
            throw err;
        }
        User.findOne({Username: UserRegInfo.Username}, function(err1, users1){
            if(err1) throw err1;
            if(users1 == null){
                User.findOne({Email: UserRegInfo.Email.trim()}, function(err2, users2){
                    if(err2) throw err2;
                    console.log(users2);
                    if(users2 == null){
                        var newUser = new User({
                            Username: UserRegInfo.Username,
                            Email: UserRegInfo.Email,
                            Password: UserRegInfo.Password,
                            Gender: UserRegInfo.Gender,
                            BlocksPerDay: null,
                            Status: null,
                            RegisterDate: new Date(),
                            LastEntry: new Date()
                        });

                        newUser.save(function(err1){
                            if(err1) {
                                throw err1;
                                res.json({type: "error"});
                            }
                            else{
                                var transporter = mail.getMailTransporter();
                                var email = mail.email();

                                var mailOptions = {
                                    from: email,
                                    to: UserRegInfo.Email,
                                    subject: 'Успешна регистрация в Energy',
                                    html: '<h3>Здравейте, ' + UserRegInfo.Username + '! Регистрацията Ви в Energy беше успешна</h3><br>' +
                                    'Към главната страница - <a href="http://energyproject.herokuapp.com">energyproject.herokuapp.com</a><br>' +
                                    '<a href="http://energyproject.herokuapp.com/blog">Към Блога и FAQ на Energy</a><br>' +
                                    'Приятен ден!'
                                };

                                transporter.sendMail(mailOptions, function(err, info){
                                    if (err) throw err;
                                    else console.log('Email sent: ' + info.response);
                                });

                                res.json({type: "success"})
                            }
                        });
                    }
                    else{
                        res.json({type: "error", title: "Зает email", text: "Вече съществува потребител с такъв email"})
                    }
                });
            }
            else{
                res.json({type: "error", title: "Заето име", text: "Вече съществува потребител с такова потребителско име"})
            }
        })

    });

});
