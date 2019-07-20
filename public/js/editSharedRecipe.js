var originalRecipeInfo = JSON.parse($("#RecipeInfo").html());

console.log(originalRecipeInfo);

$("#saveSharedRecipeInfo").on("click", function(){

    var originalRecipeInfo = JSON.parse($("#RecipeInfo").html());

    console.log(originalRecipeInfo);

    // Prepare time
    var date = new Date();
    var Day = date.getDate();
    if(Day < 10) Day = "0" + Day;
    var Month = date.getMonth()+1;
    if(Month < 10) Month = "0" + Month;
    var Year = date.getFullYear();

    var recipeInfo = originalRecipeInfo;
    recipeInfo.Name = $("#Name").val();
    recipeInfo.Date = Day + "." + Month + "." + Year;
    recipeInfo.PreparationSteps = $("#PreparationSteps").val();
    recipeInfo.Description = $("#Description").val();

    console.log(recipeInfo);

    $.post('/saveSharedRecipe', {recipeInfo: recipeInfo})
    .done(function(data){
        swal.fire({
            type: "success",
            title: "Промените са запазени"
        })
    })
    .fail(function(){
        failMessage();
    });
})
