// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;
var getUserCookie = require('./functions/getUserCookie');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

var SharedRecipes = require('../schemas/recipeSchema').SharedRecipe;

app.get('/sharedRecipes', function(req, res){

    var idCookie = getUserCookie("id", req, res);

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        SharedRecipes.find({})
            .sort({ _id: 'desc' })
            .populate("RecipeId")
            .exec(function(err, sharedRecipes) {
                res.render('sharedRecipes', {SharedRecipes: sharedRecipes, userId: idCookie});
            });
    });
});
