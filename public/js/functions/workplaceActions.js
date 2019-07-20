var WorkplaceButtons = [];
WorkplaceButtons[0] = $("#ClearWorkplace");
WorkplaceButtons[1] = $("#AddToDiary");
WorkplaceButtons[2] = $("#SaveRecipe");

function workplaceActionButtons(isBalanced){

    console.log("workplace");

    if(
        (AddedIngrediens.length > 0 & typeof currentDishBlocks == "undefined")
        ||
        (typeof currentDishBlocks != "undefined" && currentDishBlocks > 0)
    ){
        $(WorkplaceButtons[0]).removeClass("disabledAction").on("click", clearWorkplace);
        if(isBalanced == true){
            $(WorkplaceButtons[1]).removeClass("disabledAction").on("click", addToDiary);
            $(WorkplaceButtons[2]).removeClass("disabledAction").on("click", saveRecipe);
        }
    }
    else{
        for(var i = 0; i < WorkplaceButtons.length; i++){
            $(WorkplaceButtons[i]).addClass("disabledAction").off();
        }
    }
}

function clearWorkplace(){
    console.log("clear");
    // Return visible state and meal blocks to default
    $("#MealBlocks").val("3");
    $(".IngredientsContainer").empty();
    $(".Note").slideDown();
    $("#Notification").slideUp(300);
    $(".BalanceTip").slideUp(300);

    slideForm("All", "up");
    changeButton("all", "minus", "plus");

    // Empty AddedIngrediens, Blocks
    AddedIngrediens = [];
    for(var i = 0; i < IngredientTypes.length; i++){
        Blocks[IngredientTypes[i]] = 0;
    }

    $(".SumBlocks").html("0");


    // If dishbalanced, clear dish select choice
    if($(".DishSelect").length > 0){
        $(".DishSelect").val(null).trigger('change.select2');
        $("#DishBlocks").val(0).prop("disabled", true);
        $("#DishWeight").val(0).prop("disabled", true);

        DishBlocks = [];
        currentDishBlocks = 0;
        $(".DishBlocksNotification").slideUp();
    }

    workplaceActionButtons(false);
}

function addToDiary(){

    var mealBlocks = $("#MealBlocks").val();
    var ending1 = "а";
    var ending2 = "ат";
    var ending3 = "и";
    if(mealBlocks == 1){
        ending1 = ending3 = "";
        ending2 = "e";
    }

    swal({
        title: "Добавяне на ястие от " + mealBlocks + " блок" + ending1 + " в дневника си?",
        text: mealBlocks + " блок" + ending1 + " ще бъд" + ending2 +  " добавен" + ending3 + " към дневния Ви прием. Винаги можете да изтриете това ястие от Профил",
        type: "info",
        showCancelButton: true,
        confirmButtonText: "Добави",
        cancelButtonText: "Отказ"
    }).then((result) => {
        if (result.value) {

            // Prepare time
            var date = new Date();
            var Time = date.getHours();
            var Minutes = date.getMinutes();
            if(Minutes < 10) Minutes = "0" + Minutes;
            Time += ":" + Minutes;

            // Post data, clear workplace and show success popup
            $.post("/addMealToDiary", {Time: Time, Blocks: mealBlocks}, 'json')
            .done(function(){
                swal({
                  text: "Добавено!",
                  type: "success"
                })
            })
            .fail(function(){
                failMessage();
            });

            $("#AddToDiary").addClass("disabledAction").off("click");

        }
    })
}


function saveRecipe(){

    var mealBlocks = $("#MealBlocks").val();
    var ending1 = "а";
    var ending2 = "ат";
    var ending3 = "и";
    if(mealBlocks == 1){
        ending1 = ending3 = "";
        ending2 = "e";
    }

    // Collect ingredients
    var Ingredients = [];
    var UserIngredients = [];
    var UserDish = {};
    var n1 = n2 = 0;

    if($(".DishSelect").length > 0){
        UserDish.DishId = $(".DishSelect option:selected").val();
        UserDish.Weight = parseFloat($("#DishWeight").val());
    }

    for(var i = 0; i < IngredientTypes.length; i++){
        var IngredientTiles = $(".IngredientsContainer[data-ingredient-type='" + IngredientTypes[i] + "']").find(".ITile");
        for(var k = 0; k < IngredientTiles.length; k++){
            console.log($(IngredientTiles[k]).data("isuseringredient"));
            if($(IngredientTiles[k]).data("isuseringredient") != false){
                UserIngredients[n1] = {};
                UserIngredients[n1].IngredientId = $(IngredientTiles[k]).data("ingredient-id");
                UserIngredients[n1].Weight = parseFloat($(IngredientTiles[k]).find(".WeightSpan").html());
                n1++;

            }
            else{
                Ingredients[n2] = {};
                Ingredients[n2].IngredientId = $(IngredientTiles[k]).data("ingredient-id");
                Ingredients[n2].Weight = parseFloat($(IngredientTiles[k]).find(".WeightSpan").html());
                n2++;
            }

        }
    }
    console.log("Ingredients", Ingredients);
    console.log("UserIngredients", UserIngredients);
    console.log("UserDish", UserDish);

    swal({
        title: "Запазване на тази рецепта?",
        text: "Искате да запазите това ястие от " + mealBlocks + " блок" + ending1 + " в Мои рецепти?",
        html: "Въведете име за рецептата: <input type='text' id='RecipeName'>",
        type: "info",
        showCancelButton: true,
        confirmButtonText: "Запази",
        cancelButtonText: "Отказ"
    }).then((result) => {
        if (result.value) {

            // Prepare time
            var date = new Date();
            var Time = date.getHours();
            var Minutes = date.getMinutes();
            if(Minutes < 10) Minutes = "0" + Minutes;
            Time += ":" + Minutes;
            // RecipeName
            RecipeName = $("#RecipeName").val();
            if(RecipeName.length < 1) RecipeName = "Без име";

            // Post data, clear workplace and show success popup
            $.post("/saveRecipe", {Time: Time, Name: RecipeName, Blocks: mealBlocks, Ingredients: Ingredients, UserIngredients: UserIngredients, UserDish: UserDish}, 'json')
            .done(function(){
                swal({
                  text: "Запазено!",
                  type: "success"
                })
            })
            .fail(function(){
                failMessage();
            });

            $("#SaveRecipe").addClass("disabledAction").off("click");

        }
    })
}
