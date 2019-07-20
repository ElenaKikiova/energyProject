// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var getUserCookie = require('./functions/getUserCookie');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database


// ROUTES

var Ingredient = require('../schemas/ingredientSchema');
var UserIngredient = require('../schemas/userIngredientSchema');

app.get('/ingredients', function (req, res) {

    var idCookie = getUserCookie("id", req);
    res.render('ingredients', {userId: idCookie});
});

app.get('/loadAllIngredients', function (req, res) {
    var idCookie = getUserCookie("id", req);
    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        Ingredient.find({}, function(err1, defaultIngredients) {
            if(err1) throw err;
            UserIngredient.find({UserId: idCookie}, function(err2, userIngredients) {
                if(err2) throw err2;

                res.json({defaultIngredients, userIngredients});
            });
        });
    });
});
