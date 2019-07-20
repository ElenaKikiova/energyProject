function addIngredient(Ingredient){

    $(".SlideDown").slideUp(); // Slide up add form
    $(".PlusButton[data-show-type='" + Ingredient.Type + "']").removeClass("fa-minus-circle");
    $(".PlusButton[data-show-type='" + Ingredient.Type + "']").addClass("fa-plus-circle") // Toggle button's symbol

    if(AddedIngrediens.indexOf(Ingredient.Name) < 0){ // If this ingredient isn't added yet
        $(".Note[data-explain-type='" + Ingredient.Type + "']").slideUp(); // Hide explanatory note

        // Add the ingredient tile
        $(".IngredientsContainer[data-ingredient-type='" + Ingredient.Type + "']")
        .append('<div class="ITile" ' +
        'data-ingredient-type="' + Ingredient.Type + '" ' +
        'data-isUserIngredient="' + Ingredient.IsUserIngredient + '" ' +
        'data-ingredient-id="' + Ingredient.id + '">' +
            '<div class="IEdit d-flex text-center" >' +
                '<div class="IEditButton w-50" onclick="EditTile(this)" title="Редактирай"> &#9998; </div>' +
                '<div class="IDeleteButton w-50" onclick="DeleteTile(this)" title="Изтрий"> &#10006; </div>' +
            '</div>' +
            '<div class="IImage" style="background-image: url(' + "'/images/ingredientTiles/" + Ingredient.ImageName + ".png'" + ')"></div>' +
            '<div class="IInfo d-flex w-100 t-center flex-wrap justify-content-between">' +
                '<div class="px-1 flex-grow-1">' +
                    '<span class="BlocksSpan" data-ingredient-type="' + Ingredient.Type + '">' + Ingredient.Blocks +
                    '</span>бл' +
                '</div>' +
                '<div class="px-1 flex-grow-1">' +
                    '<span class="WeightSpan" data-ingredient-type="' + Ingredient.Type + '">' + Ingredient.Weight + '</span>гр' +
                '</div>' +
            '</div>' +
            '<div class="ITitle p-1">' + Ingredient.Name + '</div>' +
            '<span class="IValue d-none">' + Ingredient.Value + '</span>' +
        '</div>');

        AddedIngrediens.push(Ingredient.Name); // Add to AddedIngrediens
        Blocks[Ingredient.Type] += parseFloat(Ingredient.Blocks); // Update current ingredient type blocks sum

        maintainBalance();

    }
    else{ // If already added in AddedIngrediens
        swal({
            type: "error",
            title: "Вече сте добавили този продукт",
            text: "Можете да редактирате теглото му"
        });
    }
}

function EditTile(button){
    var Tile = $(button).parent().parent();
    var Ingredient = [];
    Ingredient.id = $(Tile).data("ingredient-id");
    Ingredient.Name = $(Tile).find(".ITitle").html();
    Ingredient.Weight = $(Tile).find(".WeightSpan").html();
    Ingredient.Blocks = $(Tile).find(".BlocksSpan").html();
    Ingredient.Type = $(Tile).data("ingredient-type");
    Ingredient.Value = $(Tile).find(".IValue").html();

    slideForm(Ingredient.Type, "down");

    var Select = $(".IngredientSelect[data-ingredient-type='" + Ingredient.Type + "']");

    // Set ingredient name as value, update select2 and disable changing
    Select.val(Ingredient.id).trigger('change.select2').prop("disabled", true);
    triggerAngular($(".IValue[data-ingredient-type='" + Ingredient.Type + "']"), Ingredient.Value);

    // Set values and enable editing of inputs
    $(".WeightInput[data-ingredient-type='" + Ingredient.Type + "']").val(Ingredient.Weight).prop("disabled", false);
    $(".BlocksInput[data-ingredient-type='" + Ingredient.Type + "']").val(Ingredient.Blocks).prop("disabled", false);

    // Hide Добави button and create Запази if it doesn't exist
    var CurrentButton = $(".SubmitIngredient[data-submit-type='" + Ingredient.Type + "']");
    $(CurrentButton).hide();
    if($("#SaveChanges").length < 1) {
        $(CurrentButton).parent().append("<button id='SaveChanges' class='w-100'>Запази</button>");
    }

    $("#SaveChanges").click(function(){
        var newBlocks = $(".BlocksInput[data-ingredient-type='" + Ingredient.Type + "']").val();  // New value for Blocks
        var BlocksDifference = newBlocks - Ingredient.Blocks; // Calculate how Blocks have changed
        // Save new values in Ingredient
        Ingredient.Weight = $(".WeightInput[data-ingredient-type='" + Ingredient.Type + "']").val();
        Ingredient.Blocks = $(".BlocksInput[data-ingredient-type='" + Ingredient.Type + "']").val();
        // Ingredient info in Tile
        var Tile = $(".ITile[data-ingredient-id='" + Ingredient.id + "']");
        $(Tile).find(".WeightSpan").html(Ingredient.Weight);
        $(Tile).find(".BlocksSpan").html(Ingredient.Blocks);
        Blocks[Ingredient.Type] += BlocksDifference;

        slideForm(Ingredient.Type, "up"); // Hide IngredientForm

        maintainBalance();
    });

}


function DeleteTile(button){
    var Tile = $(button).parent().parent();
    $(Tile).fadeOut(300);  // Hide Tile
    setTimeout(function(){$(Tile).remove(); }, 300); // and after 300ms remove Tile

    var Ingredient = [];
    Ingredient.Name = $(Tile).find(".ITitle").html();
    Ingredient.Type = $(Tile).data("ingredient-type");
    Ingredient.Blocks = $(Tile).find(".BlocksSpan").html();

    var index = jQuery.inArray(Ingredient.Name, AddedIngrediens); // get Ingredient index in AddedIngrediens
    AddedIngrediens.splice(index, 1); // remove Ingredient from AddedIngrediens
    Blocks[Ingredient.Type] -= parseFloat(Ingredient.Blocks).toFixed(1); // Update Blocks

    maintainBalance();
}
