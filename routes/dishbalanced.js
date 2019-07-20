// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var getUserCookie = require('./functions/getUserCookie');
var manageDates = require('./functions/manageDates');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

var UserCalendar = require('../schemas/userCalendarSchema');


var Recipes = require('../schemas/recipeSchema');
var Recipe = Recipes.Recipe;
var SharedRecipe = Recipes.SharedRecipe;

// ROUTES

var Ingredient = require('../schemas/ingredientSchema');
var UserDish = require('../schemas/userDishSchema');

app.get('/dishbalanced', function (req, res) {

    var idCookie = getUserCookie("id", req);
    res.render('dishbalanced', {userId: idCookie});
});

app.get('/loadUserDishes', function (req, res) {
    var idCookie = getUserCookie("id", req);
    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        UserDish.find({UserId: idCookie}, function(err, userDishes) {
            if(err) throw err;
            res.json(userDishes);
        });
    });
})

app.post('/addMealToDiary', function(req, res){
    var Time = req.body.Time;
    var Blocks = parseFloat(req.body.Blocks);
    var idCookie = getUserCookie("id", req);

    var date = new Date();
    var Year = date.getFullYear();
    var Month = manageDates.getMonth(date);
    var Day = manageDates.getDay(date);

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        UserCalendar.findOne({ UserId: idCookie, Year: Year, Month: Month, Day: Day}, function(err, todayRecord){
            if(err) throw err;

            // If first meal today
            if(todayRecord == null){
                var todayRecord = new UserCalendar({
                    UserId: idCookie,
                    Year: Year,
                    Month: Month,
                    Day: Day,
                    Blocks: Blocks,
                    Details: [
                        {
                            "time": Time,
                            "blocks": Blocks
                        }
                    ]
                });

                todayRecord.save(function(err){
                    if(err) throw err;
                });
            }
            else{
                var NewBlocksValue = todayRecord.Blocks + Blocks;
                var NewDetails = todayRecord.Details;
                NewDetails.push({"time": Time, "blocks": Blocks});

                UserCalendar.updateOne(
                    {_id: todayRecord.id},
                    {
                        $set: {
                            Blocks: NewBlocksValue,
                            Details: NewDetails
                        }
                    }, function(err){
                    if(err) throw err;
                });
            }

            res.send();
        });
    });
})

app.post('/saveRecipe', function(req, res){
    var RecipeName = req.body.Name;
    var DateSaved = manageDates.composeDate(new Date());
    var Blocks = parseFloat(req.body.Blocks);
    var Ingredients = req.body.Ingredients;
    var UserIngredients = req.body.UserIngredients;
    var IngredientWeight = req.body.IngredientWeight;
    var idCookie = getUserCookie("id", req);

    console.log(DateSaved, Blocks, Ingredients, UserIngredients);

    var newRecipe = new Recipe({
        UserId: idCookie,
        Date: DateSaved,
        Name: RecipeName,
        Blocks: Blocks,
        Ingredients: Ingredients,
        UserIngredients: UserIngredients
    });

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        newRecipe.save(function(err){ if(err) throw err});
        res.send();
    });


})
