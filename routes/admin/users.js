// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../../server');
var ObjectId = require('mongodb').ObjectID;
var checkAdministrator = require('./../functions/checkAdministrator');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../../baseUrl'); // require base url of the database


// ROUTES
var User = require('../../schemas/userSchema');
var UserProgress = require('../../schemas/userProgressSchema');
var UserIngredient = require('../../schemas/userIngredientSchema');
var UserCalendar = require('../../schemas/userCalendarSchema');

app.get('/admin/users', function (req, res) {

    checkAdministrator("admin/users", mongoose, baseUrl, ObjectId, req, res);

});


app.get('/admin/loadAllUsers', function (req, res) {

    var usersInfo = {};

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {

        User.find({}, function(err1, Users) {
            if(err1) throw err1;
            for(var i = 0; i < Users.length; i++){
                var id = (Users[i]._id).toString();
                usersInfo[id] = {
                    Username: Users[i].Username,
                    Email: Users[i].Email,
                    Status: Users[i].Status,
                    RegisterDate: Users[i].RegisterDate,
                    LastEntry: Users[i].LastEntry,
                    Records: 0,
                }
            }

            UserProgress.find({}, function(err2, Progress){
                if(err2) throw err2;
                if(Progress != null){
                    for(var i = 0; i < Progress.length; i++){
                        var id = (Progress[i].UserId).toString();
                        if(usersInfo[Progress[i].UserId] != null){
                            usersInfo[Progress[i].UserId].Records += 1;
                        }
                        else console.log("Unneeded record for user", Progress[i].UserId + "in collection Progress");
                    }
                }

                UserCalendar.find({}, function(err3, Calendar){
                    if(err3) throw err3;
                    if(Calendar != null){
                        for(var i = 0; i < Calendar.length; i++){
                            var id = (Calendar[i].UserId).toString();
                            if(usersInfo[Calendar[i].UserId] != null){
                                usersInfo[Calendar[i].UserId].Records += 1;
                            }
                            else console.log("Unneeded record for user", Calendar[i].UserId+ "in collection Calendar");
                        }
                    }

                    UserIngredient.find({}, function(err4, Ingredients){
                        if(err4) throw err4;
                        if(Ingredients != null){
                            var id = (Ingredients[i].UserId).toString();
                            if(usersInfo[Ingredients[i].UserId] != null){
                                usersInfo[Ingredients[i].UserId].Records += 1;
                            }
                            else console.log("Unneeded record for user", Ingredients[i].UserId+ "in collection UserIngredient");
                        }


                        res.json(usersInfo);
                    })
                })

            });
        });
    });

    // res.json("aa")
});

//
// app.get('/admin/loadAllUsers', function (req, res) {
//
//     console.log("get");
//
//     // mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
//     //
//     //     if(err) throw err;
//     //     var usersInfo = [];
//     //
//     //
//     // });
//
//     res.json("a")
// });
