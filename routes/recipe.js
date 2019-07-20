// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../server');
var ObjectId = require('mongodb').ObjectID;
var manageDates = require('./functions/manageDates');
var getUserCookie = require('./functions/getUserCookie');

var recipeInfo = require('./functions/recipeInfo');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../baseUrl'); // require base url of the database

var Recipes = require('../schemas/recipeSchema');
var Recipe = Recipes.Recipe;
var SharedRecipe = Recipes.SharedRecipe;

app.get('/recipe/:id', function(req, res){
    var RecipeId = req.params.id;
    var isSharedRecipe = req.query.sharedRecipe;
    var usernameCookie = getUserCookie("username", req, res);
    var idCookie = getUserCookie("id", req, res);

    console.log(isSharedRecipe, RecipeId);

    if (RecipeId.match(/^[0-9a-fA-F]{24}$/)) {
        mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {

                console.log("AA");
            if(isSharedRecipe == "true"){
                console.log("TRUE");
                SharedRecipe.findById({ _id: RecipeId })
                .populate('Ingredients.IngredientId')
                .populate('UserIngredients.IngredientId')
                .populate('UserDish.DishId')
                .exec(function(err, RecipeInfo){
                    if(err) throw err;

                    console.log("aa", RecipeInfo);
                    if(RecipeInfo != null){
                        recipeInfo.parse(RecipeInfo);
                        res.render('recipe', {RecipeInfo: RecipeInfo, userId: idCookie, isSharedRecipe: true});
                    }
                    else{
                        res.render('oups');
                    }
                });
            }
            else{
                Recipe.findById({ _id: RecipeId })
                .populate('Ingredients.IngredientId')
                .populate('UserIngredients.IngredientId')
                .populate('UserDish.DishId')
                .exec(function(err, RecipeInfo){
                    if(err) throw err;

                    if(RecipeInfo != null){
                        recipeInfo.parse(RecipeInfo);
                        res.render('recipe', {RecipeInfo: RecipeInfo, userId: idCookie});
                    }
                    else{
                        res.render('oups');
                    }
                });
            }

        });
    }
    else{
        res.render('oups');
    }

});
