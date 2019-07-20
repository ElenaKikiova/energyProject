var Table = $("#IngredientsTable");
var IngredientSum = 0;
var IngredientsCount = UserIngredientsCount = [];

for(var i = 0; i < GeneralIngredientTypes.length; i++){
    IngredientsCount[GeneralIngredientTypes[i]] = 0;
}

$.get({ url: "/loadAllIngredients" })
.done(function(data){

    // Default Ingredients
    var defaultIngredients = data.defaultIngredients;
    // User Ingredients
    var userIngredients = data.userIngredients;

    addIngredientsToTable(defaultIngredients, Table, false);
    addIngredientsToTable(userIngredients, Table, true);

    var IngredientSum = defaultIngredients.length + userIngredients.length;
    $(Info).append('<div class="text-center"><span id="SumIngredients">' + IngredientSum + '</span> продукта </div>');

    var IndexedIngredientsCount = Object.keys(IngredientsCount);
    for(var i = 0; i < IndexedIngredientsCount.length; i++){
        var currentIndex = IndexedIngredientsCount[i];

        // If user is not logged, don't show Моите продукти
        if(IngredientTypesInBG[currentIndex] == "Моите продукти" && $("#userCookieValue").html().trim().length < 1){
            break;
        }

        $(Info).append('<div class="m-2 flex-grow-1">' +
            '<div class="IngredientsHeader">' + IngredientTypesInBG[currentIndex] + '</div>' +
            '<span id="PIngredients">' + IngredientsCount[currentIndex] + '</span>' +
        '</div>');
        console.log($("#userCookieValue").html().trim().length);
        console.log($("#userCookieValue").html());

    }

    $(Info).append('<a class="Link" href="/theory">Повече за видовете продукти</a>');
    $(Info).append('<a class="Link" href="/profile#MyIngredientsSection">Добави свой продукт</a>');

    var dataTableOptions = {
        "paging": false,
        "columnDefs": [
            { "orderable": false, "targets": 3 }
        ],
        "oLanguage": {

            "sEmptyTable": "Няма резултати",
            "sSearch": "Търсене: ",
            "sZeroRecords": "Няма резултати за това търсене",
            "sInfo": "Намерени са _TOTAL_ ингредиента",
            "sInfoEmpty": "Намерени са 0 ингредиента",
            "sInfoFiltered": " от _MAX_",
            "oPaginate": {
              "sFirst": "Първа",
              "sLast": "Последна",
              "sPrevious": "❰",
              "sNext": "❱"
            }
        }
    };

    var dataTable = Table.DataTable(dataTableOptions);

    dataTable.order( [ 1, 'asc' ] ).draw();

    attachClickEvent();
    elementLoading($("body"), "hide");
})
.fail(function(error){
    failMessage();
});

function addIngredientsToTable(ingredientsArray, Table, areUserIngredients){
    for(var i = 0; i < ingredientsArray.length; i++){
        var Ingredient = ingredientsArray[i];
        var Sign = "";
        var IncrementType = "";

        // If user's Ingredients, add a * sign after Name and set increment type to UserIngredient
        if(areUserIngredients == true) {
            IncrementType = "UserIngredients";
            Sign = "*";
        }
        else{
            IncrementType = Ingredient.Type;
        }

        IngredientsCount[IncrementType] += 1;

        var Unit = "г.";

        // If note is about blocks
        if(typeof Ingredient.Note != "undefined"){
            if(Ingredient.Note.indexOf("бл") > -1){
                Unit = "бл.";
            }
        }

        // Get first letter of ingredient type in BG
        var TypeInBG = IngredientTypesInBG[Ingredient.Type];
        var TypeInBGChar =TypeInBG.slice(0, 1);
        var GI = ""; // Glycemic index
        if(Ingredient.Type == "C" && typeof Ingredient.Note != "undefined") {
            GI = "<span class='d-none' data-field='GI'>" + parseFloat(Ingredient.Note.split("GI:")[1]) + "</span>";
        }

        // Append to IngredientsTable
        Table.append("<tr data-ingredient-id='" + Ingredient._id + "'>" +
            "<td>" +
                "<div class='IngredientTypeBadge' title='" + TypeInBG + "'>" + TypeInBGChar + "</div>" +
                "<span class='d-none' data-field='Type'>" + Ingredient.Type +  "</span>" + GI +
                "<span class='d-none' data-field='ImageName'>" + Ingredient.ImageName + "</span>" +
            "</td>" +
            "<td data-field='Name'> " + Ingredient.Name + " " + Sign + "</td>" +
            "<td data-field='Value'> " + Ingredient.Value + "</td>" +
            "<td data-field='Unit'>" + Unit + "</td>" +
        "</tr>");
    }
    console.log(IngredientsCount);
}
