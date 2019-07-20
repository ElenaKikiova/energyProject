//Require Mongoose
var mongoose = require('mongoose');
var ObjectId = require('mongodb').ObjectID;

//Define schema
var RecipeIngredientSchema = mongoose.Schema({
    IngredientId: {type: mongoose.Schema.ObjectId, ref: 'Ingredient'},
    Weight: Number
});
var RecipeUserIngredientSchema = mongoose.Schema({
    IngredientId: {type: mongoose.Schema.ObjectId, ref: 'UserIngredient'},
    Weight: Number
});
var RecipeUserDishSchema = mongoose.Schema({
    DishId: {type: mongoose.Schema.ObjectId, ref: 'UserDish'},
    Weight: Number
});


var RecipeSchema = mongoose.Schema({
    UserId: ObjectId,
    Date: String,
    Name: String,
    Blocks: Number,
    Ingredients: [{ type : RecipeIngredientSchema}],
    UserIngredients: [{ type : RecipeUserIngredientSchema}],
    UserDish: [{ type : RecipeUserDishSchema}]
},
{ collection: "recipes" }
);

var Recipe = mongoose.model('Recipe', RecipeSchema);

var SharedRecipeSchema = mongoose.Schema({
    UserId: ObjectId,
    Date: String,
    Name: String,
    Blocks: Number,
    Description: String,
    Ingredients: [{ type : RecipeIngredientSchema}],
    UserIngredients: [{ type : RecipeUserIngredientSchema}],
    UserDish: [{ type : RecipeUserDishSchema}],
    Likes: Number,
    PreparationSteps: String,
},
{ collection: "sharedRecipes" }
);

var SharedRecipe = mongoose.model('SharedRecipe', SharedRecipeSchema);

module.exports = {Recipe: Recipe, SharedRecipe: SharedRecipe};
