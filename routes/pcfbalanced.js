// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var getUserCookie = require('./functions/getUserCookie');
var manageDates = require('./functions/manageDates');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database



var Recipes = require('../schemas/recipeSchema');
var Recipe = Recipes.Recipe;
var SharedRecipe = Recipes.SharedRecipe;

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

// ROUTES

var Ingredient = require('../schemas/ingredientSchema');
var UserIngredient = require('../schemas/userIngredientSchema');
var UserCalendar = require('../schemas/userCalendarSchema');

app.get('/pcfbalanced', function (req, res) {

    var idCookie = getUserCookie("id", req);
    res.render('pcfbalanced', {userId: idCookie});
});


app.get('/loadIngredients/:type', function (req, res) {
    var type = req.params.type;
    var idCookie = getUserCookie("id", req);
    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        Ingredient.find({Type: type}, function(err1, defaultIngredients) {
            if(err1) throw err1;
            UserIngredient.find({Type: type, UserId: idCookie}, function(err2, userIngredients) {
                if(err2) throw err2;
                res.json({defaultIngredients, userIngredients});
            });
        });
    });
})

app.post('/addMealToDiary', function(req, res){
    var Time = req.body.Time;
    var Blocks = parseFloat(req.body.Blocks);
    var idCookie = getUserCookie("id", req);

    var date = new Date();
    var regex = new RegExp(".+(" + monthNames[date.getMonth()] + " " + manageDates.getDay(date) + " " + date.getFullYear() + ").+");

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        UserCalendar.findOne({ UserId: idCookie, Date: {$regex: regex}}, function(err, todayRecord){
            if(err) throw err;

            // If first meal today
            if(todayRecord == null){
                var todayRecord = new UserCalendar({
                    UserId: idCookie,
                    Date: date,
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
    var UserDish = req.body.UserDish;
    var idCookie = getUserCookie("id", req);

    console.log(DateSaved, Blocks, Ingredients, UserIngredients, UserDish);

    var newRecipe = new Recipe({
        UserId: idCookie,
        Date: DateSaved,
        Name: RecipeName,
        Blocks: Blocks,
        Ingredients: Ingredients,
        UserIngredients: UserIngredients,
        UserDish: UserDish
    });

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        newRecipe.save(function(err){ if(err) throw err});
        res.send();
    });


})
