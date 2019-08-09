
// On page loading

// CalendarSection

loadUserTodayMeals();
loadUserBlocksCalendar(false);
//ProgressSection
loadUserProgressChart(false);

loadUserTodayMeals();
// MyIngredientsSection
loadUserIngredients();
// MyDishesSection
loadUserDishes();


var userId = $("#userCookieValue").html().split("|")[0].trim();

// Scrolling

window.onscroll = function(){
    if (document.body.scrollTop > 250 || document.documentElement.scrollTop > 250) $("#ToTop").fadeIn();
    else $("#ToTop").fadeOut();
}
$("#ToTop").click(function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});

// User Ingredient/Dish Form
$(".PlusButton").click(function(){
    var formType = $(this).data("show-type");
    var form = $(".SlideDown[data-show-type='" + formType + "']")[0];
    slideForm(formType, "toggle");

    // Clear inputs
    $(form).find("input[data-field='name']").val("");
    $(form).find("input[data-field='contains']").val("");

    $("#NoteAbout0").remove();
});


$("div[data-section='Settings']").click(function(){
    var username = $("#username").html().trim();
    var email = $("#email").html().trim();
    swal({
        html: '<h3>Потребител</h3>' +
            '<div class="py-2">' +
                '<div>' +
                    'Потребителско име: ' + username +
                '</div>' +
                '<div>' +
                    'E-mail: ' + email +
                '</div>' +
            '</div>' +
            '<div class="pt-2">' +
                '<a href="/changeEmail" style="color: white; text-decoration: none" class="w-100">' +
                    '<button class="w-100" style="line-height: 1.5rem">Промени email</button>' +
                '</a>' +
                '<a href="/changePassword" style="color: white; text-decoration: none" class="w-100">' +
                    '<button class="w-100" style="line-height: 1.5rem">Промени парола</button>' +
                '</a>' +
            '</div>',
        showConfirmButton: false,
        showCancelButton: false,
    })
})
