// Get recipe from stringified JSON in the page
var recipe = JSON.parse($("#RecipeInfo").html());

console.log(recipe);

var n = 0; // id for Angular
showRecipeIngredients(recipe.Ingredients);
showRecipeIngredients(recipe.UserIngredients);
if(recipe.UserDish != undefined){
    showRecipeDish(recipe.UserDish);
}

function showRecipeIngredients(array){

    console.log(array);

    var Ingredient, Blocks, Value, Weight;

    for(var i = 0; i < array.length; i++){
        Ingredient = array[i].IngredientId;
        Weight = array[i].Weight;
        Value = (Weight * Ingredient.Value / 100);
        Blocks = calcHowManyBlocks(Ingredient.Type, Value);
        console.log(Ingredient, Weight, Value, Blocks);
        if(Ingredient.ImageName == null){
            Ingredient.ImageName = "user" + Ingredient.Type;
        }

        $("#Ingredients").append('<div class="ITile" data-ingredient-type="' + Ingredient.Type + '" data-ingredient-id="' + Ingredient.id + '">' +

            '<div class="IImage" style="background-image: url(' + "'/images/ingredientTiles/" + Ingredient.ImageName + ".png'" + ')"></div>' +
            '<div class="IInfo d-flex w-100 t-center flex-wrap justify-content-between">' +
                '<div class="px-1 flex-grow-1">' +
                    '<span class="BlocksSpan" ng-bind="IngredientBlocks[' + n + ']" ng-init="IngredientBlocks[' + n + '] = ' + Blocks + '; InitialIngredientBlocks[' + n + '] = ' + Blocks + '"></span>бл' +
                '</div>' +
                '<div class="px-1 flex-grow-1">' +
                    '<span class="WeightSpan" ng-bind="IngredientWeight[' + i + ']" ng-init="IngredientWeight[' + n + '] = ' + Weight + '; InitialIngredientWeight[' + n + '] = ' + Weight + '"></span>гр' +
                '</div>' +
            '</div>' +
            '<div class="ITitle p-1">' + Ingredient.Name + '</div>' +
            '<span class="IValue d-none">' + Ingredient.Value + '</span>' +
        '</div>');

        n++;
    }
}

function showRecipeDish(UserDish){
    var userDishDIV = $("#UserDish");
    var dishInfo = UserDish[0];

    var Notification = $("<div class='Notification'></div>");


    $(Notification).append("<div>Рецептата е приготвена с полуфабрикат: </div>");
    $(Notification).append('<b><span id="DishWeight" ng-bind="UserDishWeight" ng-init="UserDishWeight = ' + dishInfo.Weight + '; InitialUserDishWeight = ' + dishInfo.Weight + '">' + dishInfo.Weight + '</span> гр. ' + dishInfo.DishId.Name + '</b>');


    $(userDishDIV).append($(Notification));

}

$("#RecipeBlocks").val(recipe.Blocks);

$("#ShareRecipe").click(function(){

    var recipeId = $("#RecipeId").html();
    console.log(recipeId);
    swal({
        type: "info",
        title: "Споделяне на рецептата?",
        text: "Тази рецепта ще бъде достъпна на всички потребители на Energy",
        confirmButtonText: "Сподели",
        cancelButtonText: "Отказ"
    }).then((result) => {
        if (result.value) {
            window.location.href = "/editSharedRecipe/" + recipeId + "?newRecipe=true";
        }
    });

});

$("#DeleteRecipe").click(function(){

    var recipeId = $("#RecipeId").html();
    console.log(recipeId);
    swal({
        type: "warning",
        title: "Наиста ли искате да изтриете тази рецепта?",
        confirmButtonText: "Изтрий",
        cancelButtonText: "Отказ"
    }).then((result) => {
        if (result.value) {

            $.post("/deleteRecipe", {id: recipeId}, 'json')
            .done(function(){
                swal({
                    type: "success",
                    title: "Изтрито!"
                });
                window.location.href = "/profile";
            })
            .fail(function(){
                failMessage();
            });
        }
    });

});
