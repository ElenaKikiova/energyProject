// Load user meals

function loadUserTodayMeals(){
    elementLoading("#CalendarSection", "show");
    $.get("/getTodayMeals")
    .done(function(data){
        var TodayDetails = $("#TodayDetails");
        console.log(data);
        TodayDetails.empty();
        if(data == null){
            $(TodayDetails).append("<div class='text-center'>Днес още не сте хапвали.");
        }
        else if(typeof data.Details != "undefined"){
            var TodayBlocks = data.Blocks;
            var Meals = data.Details;

            $("#TodayBlocksSpan").html(TodayBlocks);
            for(var i = 0; i < Meals.length; i++){
                var ending = "a";
                if(Meals[i].blocks == 1) ending = "";
                $(TodayDetails).append("<li class='Meal d-flex justify-content-between' data-day-id='" + data._id + "' data-meal-index='" + i + "'>" +
                    "<div class='d-flex'>" +
                        "<div class='LIDetails' data-type='Number'>" + (i + 1) + "</div>" +
                        "<div class='LIDetails' data-type='Time'>" + Meals[i].time + "</div>" +
                        "<div class='LIDetails' data-type='Blocks'>" + Meals[i].blocks + " блок" + ending + "</div>" +
                    "</div>" +
                    "<div class='LIDelete fas fa-trash-alt' data-delete='Meal'></div>" +
                "</li>");
            }

            // Bind click function after creating Meal
            $(".LIDelete[data-delete='Meal']").on("click", DeleteMeal);

        }
        else{
            failMessage();
        }
        elementLoading("#CalendarSection", "hide");
    })
    .fail(function(error){
        failMessage();
    });

}


$("#AddMealManually").click(function(){

    swal({
        title: "Въведи хранене в дневния прием",
        html: '<input type="number" step="0.5" min="0" id="ManuallyAddedBlocks"> блока',
        showCancelButton: true,
        confirmButtonText: "Добави",
        cancelButtonText: "Отказ"
    }).then((result) => {

        if(result.dismiss != "cancel"){

            var Blocks = parseFloat($("#ManuallyAddedBlocks").val());
            if(parseFloat(Blocks) > 0){
                var date = new Date();
                var Time = date.getHours();
                var Minutes = date.getMinutes();
                if(Minutes < 10) Minutes = "0" + Minutes;
                Time += ":" + Minutes;

                $.post("/addMealToDiary", {Time: Time, Blocks: Blocks}, 'json')
                .done(function(){
                    swal({
                      text: "Добавено!",
                      type: "success"
                    })

                    loadUserTodayMeals();
                    loadUserBlocksCalendar(true);

                })
                .fail(function(){
                    failMessage();
                });
            }

        }

    })

});

function DeleteMeal(){
    var dayId = $(this).parent().data("day-id");
    var mealIndex = $(this).parent().data("meal-index");
    var mealBlocks = parseFloat($(this).parent().find(".LIDetails[data-type='Blocks']").html());
    console.log(mealBlocks);

    swal({
        type: "warning",
        title: "Наиста ли искате да изтриете това ястие?",
        confirmButtonText: "Изтрий",
        cancelButtonText: "Отказ"
    }).then((result) => {
        if (result.value) {

            $.post("/deleteMealFromDiary", {DayId: dayId, MealIndex: mealIndex}, 'json')
            .fail(function(){
                failMessage();
            });

            // Hide meal and delete it after that
            var mealToDelete = $(".Meal[data-meal-index='" + mealIndex + "']");
            $(mealToDelete).fadeOut(300);
            setTimeout(function(){ $(mealToDelete).remove(); }, 300);
            // Update TodayBlocks
            $("#TodayBlocksSpan").html((parseFloat($("#TodayBlocksSpan").html()) - mealBlocks).toFixed(1));
            // Update Calendar
            loadUserBlocksCalendar(true);
        }
    });
};
