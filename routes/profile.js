// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;
var manageDates = require('./functions/manageDates');
var getUserCookie = require('./functions/getUserCookie');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

var User = require('../schemas/userSchema');
var UserProgress = require('../schemas/userProgressSchema');
var UserIngredient = require('../schemas/userIngredientSchema');
var UserDish = require('../schemas/userDishSchema');
var UserCalendar = require('../schemas/userCalendarSchema');


var Recipes = require('../schemas/recipeSchema');
var Recipe = Recipes.Recipe;
var SharedRecipe = Recipes.SharedRecipe;

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

app.get('/profile', function(req, res){
    var usernameCookie = getUserCookie("username", req, res);
    var idCookie = getUserCookie("id", req, res);

    if(typeof idCookie != "undefined"){
        var todayDate = manageDates.composeDate(new Date());
        mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {

            User.findOne({_id: ObjectId(idCookie)}, function(err, userInfo) {
                if(err) throw err;

                if(userInfo != null){

                    // hiddenEmail
                    var hiddenEmail = "";
                    hiddenEmail += userInfo.Email.slice(0, 1);
                    for(var i = 0; i < userInfo.Email.length - 2; i++){
                        hiddenEmail += "*";
                    }
                    hiddenEmail += userInfo.Email.slice(userInfo.Email.length - 1, userInfo.Email.length);
                    userInfo.hiddenEmail = hiddenEmail;

                    Recipe.find({ UserId: ObjectId(idCookie) }).sort('-Date')
                        .select("_id Date Name Blocks Ingredients UserIngredients")
                        .populate('Ingredients.IngredientId')
                        .populate('UserIngredients.IngredientId')
                        .exec(function(err, Recipes){
                            if(err) throw err;
                            res.render('profile', {Recipes: Recipes, userInfo: userInfo, username: usernameCookie, userId: idCookie, todayDate: todayDate});

                        });
                }
                else{
                    res.render('oups');
                }
            });
        });
    }
    else{
        res.redirect('login?error=ExpiredSession');
    }


});


app.get('/getUserProgress', function(req, res){
    var idCookie = getUserCookie("id", req);

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        UserProgress.find({UserId: idCookie}).sort({ date: 'desc' }).exec(function(err, Progress){
            if(err) throw err;

            if(Progress.length > 50){
                for(var i = 0; i < Progress.length - 50; i++){
                    Progress[i].remove();
                }
            }

            UserCalendar.find({ UserId: idCookie}).sort({ date: 'desc' }).exec(function(err, Blocks){
                if (err) throw err;

                if(Blocks.length > 30){
                    for(var i = 0; i < Blocks.length - 30; i++){
                        Blocks[i].remove();
                    }
                }

                res.json({Progress: Progress, Blocks: Blocks});

            })
        })
    });
})

app.get('/getTodayMeals', function(req, res){
    var idCookie = getUserCookie("id", req);
    var date = new Date();
    var regex = new RegExp(".+(" + monthNames[date.getMonth()] + " " + manageDates.getDay(date) + " " + date.getFullYear() + ").+");
    console.log(regex);

    // Delete all other day's details
    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        UserCalendar.updateMany({Details: { $ne: null }, Date: { $ne: date }}, { $unset: { Details: ""}}, function(err){
            if (err) throw err;
        });

        UserCalendar
            .findOne({UserId: idCookie, Date: {$regex: regex} })
            .exec(function(err, day){
                console.log(day);
                if (err) throw err;
                res.json(day);
            });
    });
})

app.post('/deleteMealFromDiary', function(req, res){
    var dayId = req.body.DayId;
    var mealIndex = parseInt(req.body.MealIndex);
    console.log(dayId, mealIndex);

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        UserCalendar.findById({_id: dayId}, function(err, day){
            if (err) throw err;

            console.log(day);

            // If this is the last meal
            if(day.Details.length == 1){
                var newDetails = [];
                newBlocks = 0;
            }
            else {
                var newDetails = day.Details;
                var deletedMeal = newDetails.splice(mealIndex, 1);
                console.log(deletedMeal);
                if(deletedMeal != null){
                    var newBlocks = (day.Blocks - deletedMeal[0].blocks).toFixed(1);
                }
            }

            UserCalendar.findByIdAndUpdate({_id: dayId}, {$set: {Details: newDetails, Blocks: newBlocks}}, function(err){
                if(err) throw err;
                res.sendStatus(200);
            });

            console.log(newDetails, newBlocks);
        });
    });

});

app.get('/getBlocks', function(req, res){
    var idCookie = getUserCookie("id", req);
    var processedData = [];

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        UserCalendar.find({ UserId: idCookie}, function(err, data){
            if (err) throw err;
            for(var i = 0; i < data.length; i++){
                var month = data[i].Month;
                var day = data[i].Day;
                if(month < 10) month = "0" + month;
                if(day < 10) day = "0" + day;
                var currentDate = data[i].Year + "-" + month + "-" + day;
                processedData[i] = {
                    "date": currentDate,
                    "badge": false,
                    "title": "Прием: ~ " + parseInt(data[i].Blocks) + " блока",
                    "text": data[i].Blocks
                }
            }
            res.json(processedData);
        })
    });
});

app.post('/deleteRecipe', function(req, res){
    var id = ObjectId(req.body.id.trim());
    Recipe.findByIdAndDelete({ _id: id}, function(err){ });

    res.send();
});

app.get('/getConstants', function(req, res){
    var Gender = req.query.Gender;
    var Measures = req.query.Measures;

    var BodyMassConstants;
    if(Gender == "F") {
        BodyMassConstants = require('../schemas/bodyMassConstantsF');
        BodyMassConstants.find({}, function(err, documents){
            if(documents != null){
                var Values = [];
                for(var i = 0; i < Object.keys(documents).length; i++){
                    var Hips = documents.Hips;
                    var Constant = documents[i].Constant;
                    Values[documents[i].Hips] = Constant;
                }
                res.json(Values);
            }
            else{
                res.json({Error: "Няма такива размери в базата данни"});
            }
        })
    }
    else{
        BodyMassConstants = require('../schemas/bodyMassConstantsM');
        var Weight = req.query.Weight;
        BodyMassConstants.findOne({Weight: Weight}, function(err, document){
            if(document != null){
                var Values = document.Values[0];
                res.json(Values);
            }
            else{
                res.json({Error: "Няма такива размери в базата данни"});
            }
        })
    }
});

app.post('/saveUserInfo', function(req, res){
    var Weight = req.body.Weight;
    var BlocksPerDay = req.body.BlocksPerDay;
    var FatBodyMassPercentage = req.body.FatBodyMassPercentage;
    var idCookie = getUserCookie("id", req);
    var date = new Date();

    User.findOneAndUpdate({_id: ObjectId(idCookie)}, {
        $set: {
            BlocksPerDay: BlocksPerDay
        }
    }, function(err){ if (err) throw err;})

    var newUserProgress = new UserProgress({
        UserId: idCookie,
        Date: date,
        Weight: Weight,
        FatBodyMassPercentage: FatBodyMassPercentage
    });

    newUserProgress.save(function(err){
        if(err) throw err;
    });

    res.send();

});

app.get('/getUserIngredients', function(req, res){
    var idCookie = getUserCookie("id", req);

    UserIngredient.find({UserId: idCookie}, function(err, userIngredients){
        if (err) throw err;
        res.json(userIngredients);
    })
});

app.post('/saveUserIngredient', function(req, res){
    var Ingredient = req.body.Ingredient;
    var idCookie = getUserCookie("id", req);

    var newIngredient = new UserIngredient({
        UserId: ObjectId(idCookie),
        Name: Ingredient.Name,
        Type: Ingredient.Type,
        Value: Ingredient.Value,
    });

    newIngredient.save(function(err){
        if(err) throw err;
    });

    res.send();
});

app.post('/updateUserIngredient', function(req, res){
    var ingredientId = ObjectId(req.body.ingredientId.trim());
    var updatedIngredient = req.body.updatedIngredient;

    UserIngredient.findByIdAndUpdate(ingredientId, {
        $set: {
            Name: updatedIngredient.Name,
            Type: updatedIngredient.Type,
            Value: updatedIngredient.Value
        }
    }, function(err){ if (err) throw err;})

    res.send();

});

app.post('/deleteUserIngredient', function(req, res){
    var id = ObjectId(req.body.id.trim());
    UserIngredient.findByIdAndDelete({ _id: id}, function(err){ });

    res.send();
});

app.post('/deleteUserDish', function(req, res){
    var id = ObjectId(req.body.id.trim());
    UserDish.findByIdAndDelete({ _id: id}, function(err){ });

    res.send();
});

app.get('/getUserDishes', function(req, res){
    var idCookie = getUserCookie("id", req);

    UserDish.find({UserId: idCookie}, function(err, userDishes){
        if (err) throw err;
        res.json(userDishes);
    })
});

app.post('/saveUserDish', function(req, res){
    var Dish = req.body.Dish;
    console.log(Dish);
    var idCookie = getUserCookie("id", req);

    var newDish = new UserDish({
        UserId: ObjectId(idCookie),
        Name: Dish.Name,
        Blocks: Dish.Blocks
    });

    console.log(newDish);

    newDish.save(function(err){
        if(err) throw err;
    });

    res.send();
});


app.post('/updateUserDish', function(req, res){
    var dishId = ObjectId(req.body.ingredientId.trim());
    var updatedDish = req.body.updatedIngredient;

    UserDish.findByIdAndUpdate(dishId, {
        $set: {
            Name: updatedDish.Name,
            Blocks: updatedDish.Blocks
        }
    }, function(err){ if (err) throw err;})

    res.send();

});

app.post('/deleteUserDish', function(req, res){
    var id = ObjectId(req.body.id.trim());
    UserDish.findByIdAndDelete({ _id: id}, function(err){ });

    res.send();
});
