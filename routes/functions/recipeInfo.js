function parse(RecipeInfo){
    var ParsedIngredientsString = "";
    var ParsedUserDishString = "";
    var TotalIngredientsLength = RecipeInfo.Ingredients.length + RecipeInfo.UserIngredients.length;
    for(var k = 0; k < RecipeInfo.Ingredients.length; k++){
        var IngredientInfo = RecipeInfo.Ingredients[k].IngredientId;
        ParsedIngredientsString += IngredientInfo.Name;
        if(k != TotalIngredientsLength.length - 1) ParsedIngredientsString += ", ";
    }
    for(var k = 0; k < RecipeInfo.UserIngredients.length; k++){
        var IngredientInfo = RecipeInfo.UserIngredients[k].IngredientId;
        ParsedIngredientsString += IngredientInfo.Name;
        if(k != TotalIngredientsLength.length - 1) ParsedIngredientsString += ", ";
    }
    if(RecipeInfo.UserDish != undefined){
        ParsedUserDishString = RecipeInfo.UserDish.DishId;
    }

    RecipeInfo.ParsedIngredientsString = ParsedIngredientsString;
    RecipeInfo.ParsedUserDishString = ParsedUserDishString;
}

module.exports = {parse};
