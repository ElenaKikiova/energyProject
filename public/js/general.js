// CONSTANTS

var IngredientTypes = ["P", "C", "F"]; // Specified ingredient types
var GeneralIngredientTypes = ["P", "C", "F", "B", "UserIngredients"]; // General ingredient types ( including Balanced and UserIngredients)

var IngredientTypesInBG = [];
IngredientTypesInBG["P"] = "Протеини";
IngredientTypesInBG["C"] = "Въглехидрати";
IngredientTypesInBG["F"] = "Мазнини";
IngredientTypesInBG["B"] = "Балансирани";
IngredientTypesInBG["UserIngredients"] = "Моите продукти";

var GramsInBlock = [];
GramsInBlock["P"] = 7;
GramsInBlock["C"] = 9;
GramsInBlock["F"] = 1.5;

var MaxValue = [];
MaxValue["P"] = 40;
MaxValue["F"] = 100;

// Added ingrediens array

var AddedIngrediens = [];
var Blocks = [];
for(var i = 0; i < IngredientTypes.length; i++){
    Blocks[IngredientTypes[i]] = 0;
}

// Loading

function elementLoading(element, action){
    $(element).css("position", "relative");
    action == "show" ? $(element).addClass("Loading") : $(element).removeClass("Loading");
}

// Slide Downs

function changeButton(Button, currentSign, wantedSign){
    if(Button != "all"){
        $(Button).removeClass("fa-" + currentSign + "-circle");
        $(Button).addClass("fa-" + wantedSign + "-circle");
    }
    else{
        var buttonsToChange = $(".fa-" + currentSign + "-circle");
        buttonsToChange.removeClass("fa-" + currentSign + "-circle");
        buttonsToChange.addClass("fa-" + wantedSign + "-circle");
    }
}


function slideForm(Type, Action){

    // Make button Добави, not Запази
    if($("#SaveChanges").length > 0){
        $("#SaveChanges").parent().find(".SubmitIngredient").show();
        $("#SaveChanges").remove();
    }

    // if type == All, slide all forms up. Otherwise slideUp, slideDown or slideToggle
    if(Type == "All"){
        // Slide all forms up
        $(".SlideDown").slideUp(300); // Slide up all forms
        changeButton($(".PlusButton"), "plus", "minus");
    }
    else{
        var Button = $(".PlusButton[data-show-type='" + Type + "']");
        // Change forms' state and buttons' symbol
        $(".SlideDown").not("[data-show-type='" + Type + "']").slideUp(300); // Slide up all forms except the needed
        // And change their button's sign to +
        changeButton($(".PlusButton").not("[data-show-type='" + Type + "']"), "minus", "plus");

        switch(Action){
            case "up":
                $(".SlideDown[data-show-type='" + Type + "']").slideUp(300); // Slide up needed for
                changeButton($(Button), "minus", "plus");
                break;
            case "down":
                $(".SlideDown[data-show-type='" + Type + "']").slideDown(300); // Slide up needed for
                changeButton($(Button), "plus", "minus");
                break;
            case "toggle":
                $(".SlideDown[data-show-type='" + Type + "']").slideToggle(300); // Toggle needed form
                if($(Button).hasClass("fa-plus-circle")){
                    changeButton($(Button), "plus", "minus");
                }
                else{
                    changeButton($(Button), "minus", "plus");
                }
                break;
        }
    }
}

function failMessage() {
    swal.fire({
        type: "error",
        title: "Опа!",
        text: "Възникна грешка. Моля пробвайте пак по-късно",
        footer: '<a href="mailto:energyproject2019@mail.ru">Свържете се с администратор</a>'
    });
}
