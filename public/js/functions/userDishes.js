
function loadUserDishes(){

    elementLoading("#MyDishesSection", "show");

    $.get({ url: "/getUserDishes"})
    .done(function (data) {
        var dishesCount = data.length;
        var myDishes = $("#myDishes");
        $(myDishes).empty();

        if(dishesCount > 0){
            $(myDishes).append("<ul class='w-100'>");
            var dishList = $(myDishes).find("ul");
            for(var i = 0; i < dishesCount; i++){
                var Dish = data[i];
                Dish.OneBlock = calc1Block(Dish.Type, Dish.Value);
                $(dishList).append('<li class="Dish d-flex justify-content-between" data-dish-id="' + Dish._id + '">' +
                    '<div class="d-flex align-items-start">' +
                        '<div class="LIDetails px-1" data-type="RecipeName">' +
                            Dish.Name +
                        '</div>' +
                        '<div class="LIDetails px-1" data-type="Blocks">' +
                            'П: ' + Dish.Blocks[0] + 'бл. | ' +
                            'В: ' + Dish.Blocks[1] + 'бл. | ' +
                            'М: ' + Dish.Blocks[2] + 'бл.' +
                        '</div>' +
                    '</div>' +
                    "<div class='LIDelete fas fa-trash-alt' data-delete='Dish'></div>" +
                '</li>');

                // Bind click function after creating Dish
                $(".LIDelete[data-delete='Dish']").on("click", DeleteDish);
            }
        }
        else{
            $(myDishes).append("<div id='NoUserDishes'>Няма въведени продукти</div>");
        }
        elementLoading("#MyDishesSection", "hide");
    })
    .fail(function(error){
        failMessage();
    });
}


$(".SubmitDish").click(function(){
    var form = $("#addDishForm");
    // Gather ingredient nutrients Values
    var zeroValues = 0;
    var Blocks = [];
    for(var i = 0; i < IngredientTypes.length; i++){
        var Input = $(form).find("input[data-field='contains'][data-type='" + IngredientTypes[i] + "']").val();
        if(Input.length > 0 && Input != "0"){
            Blocks[i] = calcHowManyBlocks(IngredientTypes[i], parseInt(Input));
        }
        else{
            Blocks[i] = 0;
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

        var Dish = {};
        Dish.Name = $(form).find("input[data-field='name']").val().trim();
        if(Dish.Name.length < 1) Dish.Name = "Без име :(";
        Dish.Blocks = Blocks;

        console.log(Dish);


        $.post("/saveUserDish", {Dish: Dish})
        .done(function(){
            swal({
              text: "Успешно добавихте полуфабрикат " + Dish.Name,
              type: "success"
            })
        })
        .fail(function(){
            failMessage();
        });

        loadUserDishes();
    }

});


function DeleteDish(){

    var li = $(this).parent();
    var dishId = $(li).data("dish-id");
    console.log(dishId);

    swal({
        title: "Наистина ли искате да изтриете този полуфабрикат?",
        text: "Изтриването е необратимо",
        type: 'warning',
        confirmButtonText: 'Изтрий!',
        showCancelButton: true,
        cancelButtonText: 'Отказ'
    }).then((result) => {
        if (result.value) {
            $(li).fadeOut(300);  // Hide Tile
            setTimeout(function(){$(li).remove(); }, 300); // and after 300ms remove Tile

            $.post("/deleteUserDish", {id: dishId})
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
