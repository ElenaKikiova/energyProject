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

console.log(Recipes);

app.get('/editSharedRecipe/:id', function(req, res){
    var recipeId = req.params.id;
    var isNewRecipe = req.query.newRecipe;
    var usernameCookie = getUserCookie("username", req, res);
    var idCookie = getUserCookie("id", req, res);

    console.log(idCookie, isNewRecipe);



    if(typeof idCookie != "undefined"){
        if (recipeId.match(/^[0-9a-fA-F]{24}$/)) {
            console.log("recipeId", recipeId, "isNewRecipe", isNewRecipe);

            mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
                if(isNewRecipe == "true"){
                    Recipe.findById({ _id: recipeId })
                    .populate('Ingredients.IngredientId')
                    .populate('UserIngredients.IngredientId')
                    .populate('UserDish.DishId')
                    .exec(function(err, RecipeInfo){
                        if(err) throw err;
                        if(RecipeInfo != null){
                            recipeInfo.parse(RecipeInfo);
                            res.render('editSharedRecipe', {RecipeInfo: RecipeInfo, userId: idCookie});
                        }
                        else{
                            res.render('oups');
                        }
                    });
                }
                else{
                    SharedRecipe.findById({ _id: recipeId })
                    .populate('Ingredients.IngredientId')
                    .populate('UserIngredients.IngredientId')
                    .populate('UserDish.DishId')
                    .exec(function(err, RecipeInfo){
                        if(err) throw err;
                        console.log(RecipeInfo);
                        if(RecipeInfo != null){
                            recipeInfo.parse(RecipeInfo);
                            res.render('editSharedRecipe', {RecipeInfo: RecipeInfo, userId: idCookie});
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
    }
    else{
        res.redirect('login?error=ExpiredSession');
    }

});

app.post('/saveSharedRecipe', function(req, res) {
    var idCookie = getUserCookie("id", req, res);
    var recipeInfo = req.body.recipeInfo;

    console.log(recipeInfo);

    var newRecipe = new SharedRecipe({
        UserId: idCookie,
        Date: recipeInfo.Date,
        Name: recipeInfo.Name,
        Description: recipeInfo.Description,
        Blocks: recipeInfo.Blocks,
        Ingredients: recipeInfo.Ingredients,
        UserIngredients: recipeInfo.UserIngredients,
        UserDish: recipeInfo.UserDish,
        PreparationSteps: recipeInfo.PreparationSteps,
        Likes: 0
    });

    mongoose.connect(baseUrl, { useNewUrlParser: true }, function(err, db) {
        newRecipe.save(function(err){ if(err) throw err});
        res.send();
    });
})
