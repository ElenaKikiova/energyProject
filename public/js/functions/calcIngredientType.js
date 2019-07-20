function calcIngredientType(Values, PredefinedType){
    var blocks = 0;
    var currentType, currentValue, currentTypeBlocks;
    var Type = "C";
    var Value = 0;

    for(var i = 0; i < IngredientTypes.length; i++){
        // Calc how many block are of current type and decide which type is dominating in this ingredient
        currentType = IngredientTypes[i];
        currentValue = Values[i];
        currentTypeBlocks = calcHowManyBlocks(currentType, currentValue);
        if(currentTypeBlocks > blocks){
            blocks = currentTypeBlocks;
            Value = currentValue;
            Type = currentType;
        }
    }
    return {"Value": Value, "Type": Type};
}
