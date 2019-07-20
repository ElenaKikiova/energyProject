
function loadUserBlocksCalendar(reload){

    if(reload == true){
        $("#BlocksCalendarContainer").empty();
        $("#BlocksCalendarContainer").append("<div id='BlocksCalendar'></div>");
    }
    else{
        // Show general block criteria
        var colorGoal = $("#colorGoal");
        $(colorGoal).css("background-color", "hsl(80, 80%, 70%)");
        $(colorGoal).html("8 блока");
    }

    $("#BlocksCalendar").zabuto_calendar({
        show_previous: 12,
        show_next: false,
        cell_border: true,
        nav_icon: {
          prev: '<i class="fa fa-chevron-circle-left"></i>',
          next: '<i class="fa fa-chevron-circle-right"></i>'
        },
        ajax: {
            url: "/getBlocks"
        }
    });

}
