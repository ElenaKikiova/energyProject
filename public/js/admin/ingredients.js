
// Load ingredients

function loadIngredients(reload){

    elementLoading($("body"), "show");

    var Table = $("#IngredientsTable");

    if(reload == true){
        $("#IngredientsTable").DataTable().destroy();
        $("#IngredientsTable>tbody").empty();
    }

    $.get({ url: "/loadAllIngredients" })
    .done(function(data){

        var defaultIngredients = data.defaultIngredients;

        addIngredientsToTable(defaultIngredients, Table, false);

        var dataTableOptions = {
            "paging": false,
            "columnDefs": [
                { "orderable": false, "targets": [3, 6] }
            ],
            "language":{
                "searchPlaceholder": "Search records"
            },
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
    });
};


function addIngredientsToTable(ingredientsArray, Table, areUserIngredients){
    for(var i = 0; i < ingredientsArray.length; i++){
        var Ingredient = ingredientsArray[i];
        var Sign = "";
        var Unit = "г.";
        // check that Note doesn't contains Glycemic index
        if(typeof Ingredient.Note != "undefined" && Ingredient.Note != ""){
            if(Ingredient.Note.indexOf("GI:") < 0) {
                Unit = Ingredient.Note; // If there is another unit, e.g. блок, брой
            }
        }

        // Get first letter of ingredient type in BG
        var TypeInBG = IngredientTypesInBG[Ingredient.Type];
        var TypeInBGChar =TypeInBG.slice(0, 1);
        var GI = ""; // Glycemic index
        if(Ingredient.Type == "C" && Ingredient.Note != null) {
            GI = "<span class='d-none' data-field='GI'>" + parseFloat(Ingredient.Note.split("GI:")[1]) + "</span>";
        }

        // Append to IngredientsTable
        if(typeof Ingredient.Note == "undefined") Ingredient.Note = "";
        Table.append("<tr data-ingredient-id='" + Ingredient._id + "'>" +
            "<td>" +
                "<div class='IngredientTypeBadge' title='" + TypeInBG + "'>" + TypeInBGChar + "</div>" +
                "<span class='d-none' data-field='Type'>" + Ingredient.Type +  "</span>" + GI +
                "<span class='d-none' data-field='ImageName'>" + Ingredient.ImageName + "</span>" +
            "</td>" +
            "<td data-field='Name'> " + Ingredient.Name + " " + Sign + "</td>" +
            "<td data-field='Value'> " + Ingredient.Value + "</td>" +
            "<td data-field='Unit'>" + Unit + "</td>" +
            "<td data-field='Note'>" + Ingredient.Note + "</td>" +
            "<td data-field='ImageName'>" + Ingredient.ImageName + ".png</td>" +
            "<td>" +
                "<div class='d-flex justify-content-around'>" +
                    "<div class='fas fa-edit EditIngredient'></div>" +
                    "<div class='fas fa-trash-alt DeleteIngredient'></div>" +
                "</div>" +
            "</td>" +
        "</tr>");
    }
}


loadIngredients(false);

$(".PlusButton").click(function(){
    slideForm("ingredientForm", "toggle");

    // Clear inputs
    $("input[data-field='Name']").val("");
    $("input[data-field='contains']").val(0);
    $("input[data-field='Note']").val("");
    $("input[data-field='ImageName']").val("1");
});


$(".SubmitIngredient").click(function(){

    // Gather ingredient nutrients Values
    var zeroValues = 0;
    var Values = [];
    for(var i = 0; i < IngredientTypes.length; i++){
        Values[i] = parseInt($("input[data-field='contains'][data-type='" + IngredientTypes[i] + "']").val());
        if(Values[i] == 0) zeroValues++;
    }

    var ImageName = $("[data-field='ImageName']").val();

    // If all entered values are zeros, don't save ingredient
    if(zeroValues == 3){
        swal({
            title: "Само нули?",
            text: "Въвели сте само нули като хранителни стойности. Този продукт е невалиден и няма да бъде съхранен"
        });
    }
    else if(ImageName.length < 1){
        ImageName = 1
    }
    else{
        // Hide SlideDown
        slideForm("addIngredientForm", "up");

        var Ingredient = {};
        Ingredient.Name = $("input[data-field='Name']").val().trim();
        if(Ingredient.Name.length < 1) Ingredient.Name = "Без име :(";
        Ingredient.Type = "C";

        // Gather Info and calculate ingredient type
        var results = calcIngredientType(Values);
        Ingredient.Type = results.Type;
        Ingredient.Value = results.Value;
        Ingredient.ImageName = ImageName;
        Ingredient.Note = $("[data-field='Note']").val();

        $.post("/admin/addIngredient", {Ingredient: Ingredient}, 'json')
        .done(function(){
            swal({
                type: "success",
                title: "Успешно добавен продукт"
            });
        })
        .fail(function(){
            swal({
                type: "error",
                title: "Възкинка грешка при записването на продукта",
            });
        });

        loadIngredients(true);
    }


});

function attachClickEvent(){
    // Some cringy way to attach event to all rows but the row in THEAD
    // $("tr:not([data-role='Header'] > tr)").click(function () {
    //     var row = $(this);
    //     var Ingredient = getIngredientInfoFromTable($(row));
    //
    //     console.log(Ingredient);
    //
    // });


    $(".EditIngredient").click(function() {
        var Row = $(this).parent().parent().parent();
        var Ingredient = [];
        Ingredient.id = $(Row).data("ingredient-id");
        Ingredient.Name = $(Row).find("[data-field='Name']").html();
        Ingredient.Type = $(Row).find("[data-field='Type']").html();
        Ingredient.Value = parseInt($(Row).find("[data-field='Value']").html());
        Ingredient.ImageName = $(Row).find("[data-field='ImageName']").html();
        Ingredient.Note = $(Row).find("[data-field='Note']").html();

        slideForm("ingredientForm", "down");

        $("#NoteAbout0").remove();

        $("input[data-field='Name']").val(Ingredient.Name);
        $("input[data-field='Note']").val(Ingredient.Note);
        $("input[data-field='ImageName']").val(Ingredient.ImageName);

        for(var i = 0; i < IngredientTypes.length; i++){
            var currentType = IngredientTypes[i];
            if(currentType == Ingredient.Type) {
                $("input[data-field='contains'][data-type='" + currentType + "']").val(Ingredient.Value);
            }
            else{
                $("input[data-field='contains'][data-type='" + currentType + "']").val(0);
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
            for(var i = 0; i < IngredientTypes.length; i++){
                Values[i] = $("input[data-field='contains'][data-type='" + IngredientTypes[i] + "']").val();
            }

            var results = calcIngredientType(Values);
            var updatedIngredient = {};
            var ingredientId = Ingredient.id;
            updatedIngredient.Name = $("input[data-field='Name']").val().trim();
            updatedIngredient.Type = results.Type;
            updatedIngredient.Value = results.Value;
            updatedIngredient.Note = $("input[data-field='Note']").val().trim();
            updatedIngredient.ImageName = $("input[data-field='ImageName']").val().trim();

            console.log(updatedIngredient);

            $.post("/admin/updateIngredient", {ingredientId: ingredientId, updatedIngredient: updatedIngredient}, 'json')
            .done(function(){
                swal({
                    title: 'Промените са запазени!',
                    type: 'success'
                })
            })
            .fail(function(){
                swal({
                    type: "error",
                    title: "Възкинка грешка при записването на резултатите"
                });
            });

            // Ingredient info in Row
            $(Row).data("ingredient-type", updatedIngredient.Type);
            $(Row).find(".IngredientTypeBadge").attr("title", IngredientTypesInBG[updatedIngredient.Type]);
            $(Row).find(".IngredientTypeBadge").html(IngredientTypesInBG[updatedIngredient.Type].slice(0, 1));
            $(Row).find("[data-field='Name']").html(updatedIngredient.Name);
            $(Row).find("[data-field='Value']").html(updatedIngredient.Value);
            $(Row).find("[data-field='ImageName']").html(updatedIngredient.ImageName);
            $(Row).find("[data-field='Note']").html(updatedIngredient.Note);

            slideForm($("#addIngredientForm"), "up"); // Hide addIngredientForm
        });
    });


    $(".DeleteIngredient").click(function(){

        swal({
            title: "Наистина ли искате да изтриете този продукт?",
            text: "Изтриването е необратимо",
            type: 'warning',
            confirmButtonText: 'Изтрий!',
            showCancelButton: true,
            cancelButtonText: 'Отказ'
        }).then((result) => {
            if (result.value) {
                var Row = $(this).parent().parent().parent();
                $(Row).fadeOut(300);  // Hide Tile
                setTimeout(function(){$(Row).remove(); }, 300); // and after 300ms remove Tile

                var ingredientId = Row.data("ingredient-id");
                console.log(ingredientId);

                $.post("/admin/deleteIngredient", {id: ingredientId})
                .done(function(){
                    swal({
                        title: 'Изтрито!',
                        type: 'success'
                    })
                })
                .fail(function(){
                    swal({
                        type: "error",
                        title: "Възкинка грешка при изтриването"
                    });
                });
            }
        })
    });
}
