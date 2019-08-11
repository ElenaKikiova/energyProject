// Load user meals

const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];

function loadUserMeals(){
    elementLoading("#CalendarSection", "show");
    $.get("/getMeals")
    .done(function(data){
        console.log(data);

        var TodayDetails = $("#TodayDetails");
        var BlocksChart = $("#BlocksChart");
        TodayDetails.empty();
        BlocksChart.empty();

        var Today;

        var BlocksForChart = {blocks: [], dates: [], colors: []};

        if(data == null){
            $(BlocksChart).append("<div class='text-center'>Още нямате данни</div>");
        }
        else{
            var k = parseFloat($("#blocksPerDay").html());
            var date = new Date();
            var regex = new RegExp(".+(" + monthNames[date.getMonth()] + " " + getDay(date) + " " + date.getFullYear() + ").+");

            for(var i = 0; i < data.length; i++){
                BlocksForChart.blocks.push(data[i].Blocks)
                BlocksForChart.dates.push(composeDate(data[i].Date));
                if(data[i].Blocks < 11) BlocksForChart.colors[i] = "grey";
                else if(data[i].Blocks > 17) BlocksForChart.colors[i] = "grey";
                else BlocksForChart.colors[i] = "hsl(" + data[i].Blocks * k +  ", 70%, 70%)";

                if(regex.test(data[i].Date) && data[i].Details != null){
                    Today = data[i];
                }
            }

            if(Today != undefined){
                var Meals = Today.Details;
                $("#TodayBlocksSpan").html(Today.Blocks);

                for(var i = 0; i < Meals.length; i++){
                    var ending = "a";
                    if(Meals[i].blocks == 1) ending = "";
                    $(TodayDetails).append("<li class='Meal d-flex justify-content-between' data-day-id='" + Today._id + "' data-meal-index='" + i + "'>" +
                        "<div class='d-flex'>" +
                            "<div class='LIDetails' data-type='Number'>" + (i + 1) + "</div>" +
                            "<div class='LIDetails' data-type='Time'>" + Meals[i].time + "</div>" +
                            "<div class='LIDetails' data-type='Blocks'>" + Meals[i].blocks + " блок" + ending + "</div>" +
                        "</div>" +
                        "<div class='LIDelete fas fa-trash-alt' data-delete='Meal'></div>" +
                    "</li>");
                }
            }

            // Chart

            var blocksChart = new Chart(document.getElementById('BlocksChart').getContext('2d'), {
                type: 'bar',
                data: {
                    labels: BlocksForChart.dates,
                    datasets: [
                        {
                            label: 'Блокове на ден',
                            backgroundColor: BlocksForChart.colors,
                            borderColor: BlocksForChart.colors,
                            data: BlocksForChart.blocks
                        }
                    ]
                },
                options: {
                    scales: {
                        yAxes: [{
                            display: true,
                            ticks: {
                                suggestedMin: 0,
                                suggestedMax: 17
                            }
                        }]
                    },
                    legend: {
                        display: false
                    }
                }
            });

            // Bind click function after creating Meal
            $(".LIDelete[data-delete='Meal']").on("click", DeleteMeal);

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

                    loadUserMeals();
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
            // Update
            loadUserMeals();
        }
    });
};
