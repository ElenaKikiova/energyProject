// Create Panes

// Set ClearWorkplace, AddToDiary and SaveAsRecipe buttons disabled
workplaceActionButtons(false);

// Blocks value for P, C and F for 100g of dish
var DishBlocksFor100g = [];

// Current blocks added from dish
var DishBlocks = [];

// mealBlocks for 100g of dish
var dishBlocksFor100g = 0;
var currentDishBlocks = 0;


for(var i = 0; i < IngredientTypes.length; i++){
    $("#PaneContainer").append('<div class="Pane col-s-12 col-md-4" data-ingredient-type="' + IngredientTypes[i] + '"></div>');
    var Pane = $(".Pane[data-ingredient-type='" + IngredientTypes[i] + "']");

    $(Pane).append('<div class="text-center">' +
        '<h4>' + IngredientTypesInBG[IngredientTypes[i]].toUpperCase() + '</h4>' +
        '<p>Общо <span class="SumBlocks" data-sum-type="' + IngredientTypes[i] + '">0</span> бл</p>' +
        '<div class="DishBlocksNotification Notification" data-sum-type="' + IngredientTypes[i] + '"></div>' +
        '<div class="BalanceTip Notification" data-ingredient-type="' + IngredientTypes[i] + '"></div>' +
    '</div>');

    $(Pane).append('<div>'+
    '<button type="button" class="PlusButton mx-auto fas fa-plus-circle" data-show-type="' + IngredientTypes[i] + '"></button>' +
    '<div class="SlideDown" data-show-type="' + IngredientTypes[i] + '">' +
        '<div class="d-flex justify-content-between flex-wrap">' +
            '<select class="IngredientSelect flex-grow-1" data-ingredient-type="' + IngredientTypes[i] + '">' +
                '<option></option>' +
            '</select>' +
            '<input ng-model="IValue[' + i + ']" class="IValue d-none" data-ingredient-type="' + IngredientTypes[i] + '">' +
            '<div class="w-100" id="Inputs">' +
                '<input type="number" step="1" class="WeightInput" data-ingredient-type="' + IngredientTypes[i] + '" min="0" max="1000" ng-model="IWeight[' + i + ']" ng-change="changeWeight(' + i + ')" ng-keyup="changeWeight(' + i + ')"> гр. = ' +
                '<input type="number" step="0.1" class="BlocksInput" data-ingredient-type="' + IngredientTypes[i] + '" min="0" ng-model="IBlocks[' + i + ']" ng-change="changeBlocks(' + i + ')" ng-keyup="changeBlocks(' + i + ')"> бл.' +
            '</div>' +
        '</div>' +
        '<div>' +
            '<button class="SubmitIngredient w-100 mx-auto" data-submit-type="' + IngredientTypes[i] + '">Добави</button>' +
        '</div>' +
    '</div>' +
    '</div>');

    $(Pane).append('<div class="IngredientsContainer d-flex flex-wrap justify-content-center" data-ingredient-type="' + IngredientTypes[i] + '"></div>');

    $(Pane).append('<div class="Note text-center" data-explain-type="' + IngredientTypes[i] + '">' +
        '<p>' +
            'В този раздел ще попадат всички продукти с преобладаващо съдържание на ' +
                IngredientTypesInBG[IngredientTypes[i]].toLowerCase() +
            '.<br> За да добавите продукт, натиснете бутона +' +
        '</p>' +
        '<p>' +
            '1 блок ' + IngredientTypesInBG[IngredientTypes[i]].toLowerCase() + ' = ' + GramsInBlock[IngredientTypes[i]] + 'гр.' +
        '</p>' +
    '</div>');
}

// Load Dishes

elementLoading("#DishContainer", "show"); // Show Loading

$.get({ url: "/loadUserDishes"})
.done(function(dishesArray){
    if(dishesArray.length > 0){
        var Select = $(".DishSelect"); // Dish select
        // Add dishes to select
        for(var i = 0; i < dishesArray.length; i++){
            var Dish = dishesArray[i];
            var Blocks = Dish.Blocks;
            $(Select).append("<option value='" + Dish._id + "' " +
            "data-p-block-value='" + Blocks[0] + "' " +
            "data-c-block-value='" + Blocks[1] + "' " +
            "data-f-block-value='" + Blocks[2] + "'>" + Dish.Name + "</option>");
        }
    }
    elementLoading("#DishContainer", "hide"); // Show Loading
})
.fail(function(error){
    failMessage();
});


$(".DishSelect").select2({ placeholder: "Изберете полуфабрикат" }); // Use Select2 plugin and set placeholder

$(".DishSelect").change(function(){
    dishBlocksFor100g = 0;
    DishBlocksFor100g = [];
    var DishWeightInput = $("#DishWeight");
    var DishBlocksInput = $("#DishBlocks");
    var DishWeight = parseInt($(DishWeightInput).val());


    $(DishWeightInput).removeAttr("disabled");
    $(DishBlocksInput).removeAttr("disabled");
    $(DishWeightInput).val(100);
    DishWeight = 100;

    // Get new dish
    var SelectedDish = $(".DishSelect option:selected");
    console.log(SelectedDish);

    // Calculate max blocks of the dish
    for(var i = 0; i < IngredientTypes.length; i++){
        console.log(IngredientTypes[i].toLowerCase() + "-block-value");
        DishBlocksFor100g[i] = parseFloat($(SelectedDish).data(IngredientTypes[i].toLowerCase() + "-block-value"));
        if(DishBlocksFor100g[i] > dishBlocksFor100g) dishBlocksFor100g = DishBlocksFor100g[i];
    }

    console.log(DishBlocksFor100g, DishWeight);

    // Set meal size as of 100g of dish
    $("#MealBlocks").val(dishBlocksFor100g);
    currentDishBlocks = dishBlocksFor100g;
    $(DishBlocksInput).val(dishBlocksFor100g);
    $("#DishBlocks").val(dishBlocksFor100g);
    console.log(DishBlocksInput, dishBlocksFor100g);

    $("#PaneContainer").slideDown();
    blocksAddedFromDish(DishWeight);
    maintainBalance();

});

function blocksAddedFromDish(DishWeight) {
    // Show blocks added from dish
    for(var i = 0; i < IngredientTypes.length; i++){
        DishBlocks[i] = parseFloat((DishWeight * DishBlocksFor100g[i] / 100).toFixed(1));
        console.log("00000000");
        console.log("DishBlocks", IngredientTypes[i], DishBlocks[i]);
        console.log("SumBlocks", IngredientTypes[i], DishBlocks[i] + Blocks[IngredientTypes[i]]);
        $(".SumBlocks[data-sum-type='" + IngredientTypes[i] + "']").html(DishBlocks[i] + Blocks[i]);
        var dishBlocksNotification = $(".DishBlocksNotification[data-sum-type='" + IngredientTypes[i] + "']");
        $(dishBlocksNotification).html("<b>" + DishBlocks[i] + "</b> бл. от полуфабрикат");
        $(dishBlocksNotification).slideDown();
    }
}

$("#DishWeight").on("keyup, mouseup, change", function(){
    var newDishWeight = parseFloat($(this).val());
    var newDishBlocks = parseFloat((dishBlocksFor100g * newDishWeight / 100).toFixed(1));
    var dishBlocksDifference = newDishBlocks - currentDishBlocks;
    var currentMealBlocks = parseFloat($("#MealBlocks").val());
    var newMealBlocks = parseFloat((currentMealBlocks + dishBlocksDifference).toFixed(1));

    currentDishBlocks = newDishBlocks;
    console.log("Dish netto ", currentDishBlocks);
    console.log("Make dish: ", newDishBlocks, " add: ", dishBlocksDifference);
    console.log("Was meal blocks", currentMealBlocks);
    console.log("become ", newMealBlocks);
    $("#MealBlocks").val(newMealBlocks);
    $("#DishBlocks").val(newDishBlocks);

    blocksAddedFromDish(newDishWeight);
    maintainBalance();
});

$("#DishBlocks").on("keyup, mouseup, change", function(){
    var newDishBlocks = parseFloat($(this).val());
    var newDishWeight = parseInt(newDishBlocks * 100 / dishBlocksFor100g);
    var dishBlocksDifference = parseFloat((newDishBlocks - currentDishBlocks).toFixed(1));
    var currentMealBlocks = parseFloat($("#MealBlocks").val());
    var newMealBlocks = parseFloat((currentMealBlocks + dishBlocksDifference).toFixed(1));

    currentDishBlocks = newDishBlocks;
    console.log("Dish netto ", currentDishBlocks);
    console.log("Make dish: ", newDishBlocks, " add: ", dishBlocksDifference);
    console.log("Was meal blocks", currentMealBlocks);
    console.log("become ", newMealBlocks);
    $("#MealBlocks").val(newMealBlocks);
    $("#DishWeight").val(newDishWeight);

    blocksAddedFromDish(newDishWeight);
    maintainBalance();
});

// Load Ingredients

for(var i = 0; i < Object.keys(IngredientTypes).length; i++){

    elementLoading(".SlideDown[data-show-type='" + IngredientTypes[i] + "']", "show"); // Show Loading

    $.get({ url: "/loadIngredients/" + IngredientTypes[i] })
    .done(function(data){

        // Default Ingredients
        var defaultIngredients = data.defaultIngredients;
        // User Ingredients
        var userIngredients = data.userIngredients;

        var Type = defaultIngredients[0].Type;
        var Select = $(".IngredientSelect[data-ingredient-type='" + Type + "']"); // Current <select>


        // Add defaultIngredients to select, and if there are userIngredients, add them too
        addIngredientsToSelect(defaultIngredients, false, Type, Select);
        if(userIngredients.length > 0) addIngredientsToSelect(userIngredients, true, Type, Select);

        elementLoading(".SlideDown[data-show-type='" + Type + "']", "hide"); // Hide Loading
    })
    .fail(function(error){
        failMessage();
    });
}

$(".IngredientSelect").select2({ placeholder: "Изберете продукт" }); // Use Select2 plugin and set placeholder

function addIngredientsToSelect(ingredientsArray, IsUserIngredient, Type, Select){
    for(var i = 0; i < ingredientsArray.length; i++){
        var Ingredient = ingredientsArray[i];
        var Blocks = calc1Block(Type, Ingredient.Value);
        if(Ingredient.ImageName == null){
            Ingredient.ImageName = "user" + Ingredient.Type;
        }
        $(Select).append("<option value='" + Ingredient._id + "' " +
        "data-block-value='" + Blocks + "' " +
        "data-isUserIngredient='" + IsUserIngredient + "' " +
        "data-note='" + Ingredient.Note + "' " +
        "data-image='" + Ingredient.ImageName + "'>" + Ingredient.Name + "</option>");
    }
}


$(".PlusButton").click(function(){

    // Determine whether Proteins or Carbs are added
    var Type = $(this).data("show-type");

    // Return to default and enable select, disable and set to 0 inputs
    $(".IngredientSelect[data-ingredient-type='" + Type + "']").val(null).trigger('change.select2').prop("disabled", false);
    $(".WeightInput[data-ingredient-type='" + Type + "']").val(0).prop("disabled", true);
    $(".BlocksInput[data-ingredient-type='" + Type + "']").val(0).prop("disabled", true);

    $("#NoteAboutEggs").remove();

    slideForm(Type, "toggle");

});

// Enter default value for weight input (1 block) when an ingredient is chosen
$(".IngredientSelect").change(function(){
    var Type = $(this).data("ingredient-type");
    var SelectedIngredient = $(".IngredientSelect[data-ingredient-type = '" + Type + "'] option:selected");
    var IngredientName = $(SelectedIngredient).html().trim();
    var IngredientValue = $(SelectedIngredient).data("block-value");
    var IngredientValueSpan = $(".IValue[data-ingredient-type='" + Type + "']");

    // Trigger Angular calculation
    triggerAngular(IngredientValueSpan, IngredientValue);

    // Set inputs to values of 1 block and enable editing
    $(".WeightInput[data-ingredient-type = '" + Type + "']").val(IngredientValue).prop("disabled", false);
    $(".BlocksInput[data-ingredient-type = '" + Type + "']").val(1).prop("disabled", false);

    $("#NoteAboutEggs").remove();

    switch(IngredientName){
        case "Яйце":
            $("<div class='Notification w-100' id='NoteAboutEggs'>1 яйце ~ 1 блок протеини</div>").insertAfter($("#Inputs"));
            break;
        case "Яйчен белтък":
            $("<div class='Notification w-100' id='NoteAboutEggs'>1 яйчен белтък ~ 0,5 блока протеини</div>").insertAfter($("#Inputs"));
            break;
    }
});


function triggerAngular(IngredientValueSpan, IngredientValue){
    $(IngredientValueSpan).val(IngredientValue);
    $(IngredientValueSpan).trigger('input'); // Use for Chrome/Firefox/Edge
    $(IngredientValueSpan).trigger('change'); // Use for Chrome/Firefox/Edge + IE11
}


// Add ingredients

$(".SubmitIngredient").click(function(){
    // Get submitted data
    var Ingredient = {};
    Ingredient.Type = $(this).data("submit-type");
    Ingredient.id = $(".IngredientSelect[data-ingredient-type = '" + Ingredient.Type + "']").val();
    Ingredient.Weight = $(".WeightInput[data-ingredient-type = '" + Ingredient.Type + "']").val();

    if(Ingredient.id != null & Ingredient.Weight > 0){
        var Option = $(".IngredientSelect[data-ingredient-type = '" + Ingredient.Type + "'] option:selected");
        Ingredient.Name = $(Option).html();
        Ingredient.IsUserIngredient = $(Option).data("isuseringredient");
        Ingredient.Value = $(Option).data("block-value");
        Ingredient.ImageName = $(Option).data("image");
        Ingredient.Blocks = $(".BlocksInput[data-ingredient-type = '" + Ingredient.Type + "']").val();
        console.log(Ingredient);
        // Add Ingredient
        addIngredient(Ingredient);
    }

});


// Manage meal blocks

$("#MealBlocks").on("keyup, mouseup, change", function(){
    var DishBlocks = parseFloat($("#DishBlocks").val());
    if($(this).val() >= 0.1) {
        if($(this).val() < DishBlocks){
            $(this).val(DishBlocks);
            swal({
                type: "error",
                title: "Блоковете на ястието са по-малко от блоковете на полуфабриката!",
                text: "Ако искате да намалите блоковете на ястоието, първо намалете тези на полуфабриката"
            })
        }
        maintainBalance();
    }
    else $(this).val(0.1);
});
