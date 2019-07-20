//Require Mongoose
var mongoose = require('mongoose');

//Define a schema
var IngredientSchema = mongoose.Schema({
    Name: String,
    Type: String,
    Value: Number,
    Note: String,
    ImageName: Number,
},
{ collection: "ingredients" }
);

var Ingredient = mongoose.model('Ingredient', IngredientSchema);

module.exports = Ingredient;
