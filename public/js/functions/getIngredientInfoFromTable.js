function getIngredientInfoFromTable(IngredientRow){
    var Ingredient = {};
    Ingredient.id = $(IngredientRow).data("ingredient-id");
    Ingredient.Type = $(IngredientRow).find("[data-field='Type']").html().trim();
    Ingredient.Name = $(IngredientRow).find("[data-field='Name']").html();
    Ingredient.Value = parseFloat($(IngredientRow).find("[data-field='Value']").html());
    Ingredient.Unit = $(IngredientRow).find("[data-field='Unit']").html();
    Ingredient.ImageName = $(IngredientRow).find("[data-field='ImageName']").html();

    if(Ingredient.ImageName == "undefined"){
        Ingredient.ImageName = "user" + Ingredient.Type;
    }

    // Glycemic index
    if(Ingredient.Type == "C" && $(IngredientRow).find("[data-field='GI']").length > 0){
        Ingredient.GI = $(IngredientRow).find("[data-field='GI']").html();
    }

    Ingredient.TypeInBG = IngredientTypesInBG[Ingredient.Type];

    // Calc how many grams are 1 block if type is not Balanced
    if(Ingredient.Type != "B" && Ingredient.Unit == "г."){
        Ingredient.OneBlock = calc1Block(Ingredient.Type, Ingredient.Value);
    }
    else{
        Ingredient.OneBlock = Ingredient.Value;
    }

    console.log(Ingredient);

    return Ingredient;
}
