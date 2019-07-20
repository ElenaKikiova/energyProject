function loadUserIngredients(){

    elementLoading("#MyIngredientsSection", "show");

    $.get({ url: "/getUserIngredients"})
    .done(function (data) {
        var ingredientsCount = data.length;
        var myIngredients = $("#myIngredients");
        $(myIngredients).empty();

        if(ingredientsCount > 0){
            for(var i = 0; i < ingredientsCount; i++){
                var Ingredient = data[i];
                Ingredient.OneBlock = calc1Block(Ingredient.Type, Ingredient.Value);
                $(myIngredients).append('<div class="ITile" data-ingredient-type="' + Ingredient.Type + '" data-ingredient-id="' + Ingredient._id + '">' +
                    '<div class="IEdit d-flex text-center" >' +
                        '<div class="IEditButton w-50" onclick="EditIngredient(this)" title="Редактирай"> &#9998; </div>' +
                        '<div class="IDeleteButton w-50" onclick="DeleteIngredient(this)" title="Изтрий"> &#10006; </div>' +
                    '</div>' +
                    '<div class="IImage" style="background-image: url(' +
                        "'/images/ingredientTiles/user" + Ingredient.Type +  ".png'" +
                    ')"></div>' +
                    '<div class="IInfo d-flex w-100 t-center flex-wrap justify-content-between">' +
                        '<div class="px-1 flex-grow-1"> 1бл </div>' +
                        '<div class="px-1 flex-grow-1">' +
                            '<span class="OneBlockSpan">' + Ingredient.OneBlock + '</span>гр' +
                        '</div>' +
                    '</div>' +
                    '<div class="ITitle p-1">' + Ingredient.Name + '</div>' +
                    '<span class="IValue d-none">' + Ingredient.Value + '</span>' +
                '</div>');
            }
        }
        else{
            $(myIngredients).append("<div id='NoUserIngredients'>Няма въведени продукти</div>");
        }

        elementLoading("#MyIngredientsSection", "hide");
    })
    .fail(function(error){
        failMessage();
    });
}


$(".SubmitIngredient").click(function(){
    var form = $("#addIngredientForm");
    // Gather ingredient nutrients Values
    var zeroValues = 0;
    var Values = [];
    for(var i = 0; i < IngredientTypes.length; i++){
        var Input = $(form).find("input[data-field='contains'][data-type='" + IngredientTypes[i] + "']").val();

        if(Input.length > 0 && Input != "0"){
            Values[i] = parseInt(Input);
        }
        else{
            Values[i] = 0;
            zeroValues++;
        }
    }

    // If all entered values are zeros, don't save ingredient
    if(zeroValues == 3){
        swal({
            title: "Само нули?",
            text: "Въвели сте само нули като хранителни стойности. Този продукт е невалиден и няма да бъде съхранен"
        });
    }
    else{
        // Hide SlideDown
        slideForm("addIngredientForm", "up");

        var Ingredient = {};
        Ingredient.Name = $(form).find("input[data-field='name']").val().trim();
        if(Ingredient.Name.length < 1) Ingredient.Name = "Без име :(";
        Ingredient.Type = "C";

        // Gather Info and calculate ingredient type
        var results = calcIngredientType(Values);
        Ingredient.Type = results.Type;
        Ingredient.Value = results.Value;


        $.post("/saveUserIngredient", {Ingredient: Ingredient})
        .done(function(){
            swal({
              text: "Успешно добавихте продукт " + Ingredient.Name,
              type: "success"
            })
        })
        .fail(function(){
            failMessage();
        });

        loadUserIngredients();
    }

});

function EditIngredient(button) {
    var Tile = $(button).parent().parent();
    var Ingredient = [];
    Ingredient.id = $(Tile).data("ingredient-id");
    Ingredient.Name = $(Tile).find(".ITitle").html();
    Ingredient.Type = $(Tile).data("ingredient-type");
    Ingredient.Value = $(Tile).find(".IValue").html();

    slideForm("userIngredientForm", "down");

    $("#NoteAbout0").remove();

    $("input[data-field='name']").val(Ingredient.Name);

    for(var i = 0; i < IngredientTypes.length; i++){
        var currentType = IngredientTypes[i];
        if(currentType == Ingredient.Type) {
            $("input[data-field='contains'][data-type='" + currentType + "']").val(Ingredient.Value);
        }
        else{
            $("input[data-field='contains'][data-type='" + currentType + "']").val();
        }
    }

    $('<div class="Notification" id="NoteAbout0">Стойностите на веществата, които не са водещи в продукта, са нулирани </div>').insertBefore($(".SubmitIngredient"));
    $('<div id="DBId" class="d-none">' + Ingredient.id + '</div>').insertBefore($(".SubmitIngredient"));

    // Hide Добави button and create Запази if it doesn't exist
    var CurrentButton = $(".SubmitIngredient");
    $(CurrentButton).hide();
    if($("#SaveChanges").length < 1) {
        $(CurrentButton).parent().append("<button id='SaveChanges' class='w-100'>Запази</button>");
    }

    $("#SaveChanges").click(function(){
        // Set new value
        var Values = [];
        var zeroValues = 0;
        for(var i = 0; i < IngredientTypes.length; i++){
            var Input = $("input[data-field='contains'][data-type='" + IngredientTypes[i] + "']").val();
            console.log(Input, Input.length);
            if(Input.length > 0 && Input != "0"){
                Values[i] = parseInt(Input);
            }
            else{
                Values[i] = 0;
                zeroValues++;
            }
        }

        // If all entered values are zeros, don't save ingredient
        if(zeroValues == 3){
            swal({
                title: "Само нули?",
                text: "Въвели сте само нули като хранителни стойности. Този продукт е невалиден и няма да бъде съхранен"
            });
        }
        else{
            // Hide SlideDown
            slideForm("addIngredientForm", "up");
            var results = calcIngredientType(Values);
            var updatedIngredient = {};
            var ingredientId = Ingredient.id;
            updatedIngredient.Name = $("input[data-field='name']").val().trim();
            updatedIngredient.Type = results.Type;
            updatedIngredient.Value = results.Value;
            updatedIngredient.OneBlock = calc1Block(updatedIngredient.Type, updatedIngredient.Value);

            $.post("/updateUserIngredient", {ingredientId: ingredientId, updatedIngredient: updatedIngredient}, 'json')
            .fail(function(){
                failMessage();
            });

            // Ingredient info in Tile
            var Tile = $(".ITile[data-ingredient-id='" + Ingredient.id + "']");
            $(Tile).data("ingredient-type", updatedIngredient.Type);
            $(Tile).find(".ITitle").html(updatedIngredient.Name);
            $(Tile).find(".IValue").html(updatedIngredient.Value);
            $(Tile).find(".OneBlockSpan").html(updatedIngredient.OneBlock);
            $(Tile).find(".IImage").css("background-image", "url(/images/ingredientTiles/user" + updatedIngredient.Type + ".png)");
        }
    });
}

function DeleteIngredient(button){

    swal({
        title: "Наистина ли искате да изтриете този продукт?",
        text: "Изтриването е необратимо",
        type: 'warning',
        confirmButtonText: 'Изтрий!',
        showCancelButton: true,
        cancelButtonText: 'Отказ'
    }).then((result) => {
        if (result.value) {
            var Tile = $(button).parent().parent();
            $(Tile).fadeOut(300);  // Hide Tile
            setTimeout(function(){$(Tile).remove(); }, 300); // and after 300ms remove Tile

            var ingredientId = $(Tile).data("ingredient-id");

            $.post("/deleteUserIngredient", {id: ingredientId})
            .done(function(){
                swal({
                    title: 'Изтрито!',
                    type: 'success'
                })
            })
            .fail(function(){
                failMessage();
            });
        }
    })

}
