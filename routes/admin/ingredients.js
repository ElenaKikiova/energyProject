// REQUIRE APP AND GENERAL FUNCTIONS
var app = require('../../server');
var ObjectId = require('mongodb').ObjectID;
var checkAdministrator = require('./../functions/checkAdministrator');

// Mongoose
var mongoose = require('mongoose');
const baseUrl = require('../../baseUrl'); // require base url of the database


// ROUTES
var Ingredient = require('../../schemas/ingredientSchema');

app.get('/admin', function (req, res) {
    checkAdministrator("admin/ingredients", mongoose, baseUrl, ObjectId, req, res);
});


app.get('/admin/ingredients', function (req, res) {
    checkAdministrator("admin/ingredients", mongoose, baseUrl, ObjectId, req, res);
});


app.post('/admin/addIngredient', function(req, res){
    var IngredientInfo = req.body.Ingredient;
    console.log(IngredientInfo);

    var newIngredient = new Ingredient({
        Name: IngredientInfo.Name,
        Type: IngredientInfo.Type,
        Value: IngredientInfo.Value,
        Note: IngredientInfo.Note,
        ImageName: IngredientInfo.ImageName
    });

    newIngredient.save();
    res.send(200);
});

app.post('/admin/updateIngredient', function(req, res){
    var ingredientId = ObjectId(req.body.ingredientId.trim());
    var updatedIngredient = req.body.updatedIngredient;
    console.log(ingredientId, updatedIngredient, updatedIngredient.Note, updatedIngredient.ImageName);

    Ingredient.findByIdAndUpdate(ingredientId, {
        $set: {
            Name: updatedIngredient.Name,
            Type: updatedIngredient.Type,
            Value: updatedIngredient.Value,
            Note: updatedIngredient.Note,
            ImageName: updatedIngredient.ImageName
        }
    }, function(err){ })
    res.send(200);
})

app.post('/admin/deleteIngredient', function(req, res){
    var id = ObjectId(req.body.id.trim());
    Ingredient.findByIdAndDelete({ _id: id}, function(err){ });
    res.send(200);
});
