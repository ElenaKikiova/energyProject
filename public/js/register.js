var invalidFields = {};
invalidFields["Username"] = invalidFields["Password"] = invalidFields["Email"] = 0;

$("#username").on("change, keyup", function(){
    var Username = $(this);
    var UsernameNotification = $("#UsernameNotification");

    if(Username.val().length < 4 || Username.val().length > 15){
        Username.addClass("InvalidInput");
        UsernameNotification.html("Потребителското име трябва да е 4 - 15 символа");
        UsernameNotification.slideDown();
        invalidFields["Username"] = 1;
    }
    else if(Username.val().indexOf(" ") != -1){
        Username.addClass("InvalidInput");
        UsernameNotification.html("Потребителското име не трябва да съдържа интервали");
        UsernameNotification.slideDown();
        invalidFields["Username"] = 1;
    }
    else{
        Username.removeClass("InvalidInput");
        UsernameNotification.slideUp();
        invalidFields["Username"] = 0;
    }
});

$("input[type='password']").on("change, keyup", function(){
    var Password = $("#password");
    var PasswordRepeat = $("#passwordRepeat");
    var PasswordNotification = $("#PasswordNotification");

    if( Password.val() != 0 && PasswordRepeat.val() != 0 &&
        Password.val() != PasswordRepeat.val()){
        $(Password).addClass("InvalidInput");
        $(PasswordRepeat).addClass("InvalidInput");
        PasswordNotification.html("Паролите не съвпадат");
        PasswordNotification.slideDown();
        invalidFields["Password"] = 1;
    }
    else if(Password.val().length < 6 || Password.val().length > 20){
        $(Password).addClass("InvalidInput");
        $(PasswordRepeat).addClass("InvalidInput");
        PasswordNotification.html("Паролата трябва да е 6 - 20 символа");
        PasswordNotification.slideDown();
        invalidFields["Password"] = 1;
    }
    else if(Password.val().indexOf(" ") != -1){
        $(Password).addClass("InvalidInput");
        $(PasswordRepeat).addClass("InvalidInput");
        PasswordNotification.html("Паролата не трябва да съдържа интервали");
        PasswordNotification.slideDown();
        invalidFields["Password"] = 1;
    }
    else{
        $(Password).removeClass("InvalidInput");
        $(PasswordRepeat).removeClass("InvalidInput");
        PasswordNotification.slideUp();
        invalidFields["Password"] = 0;
    }
});


$("#email").on("change, keyup", function(){

    var input = $(this);
    var inputValue = input.val();

    if(inputValue.length < 5){
        $("#EmailNotification").html("Email адресът е невалиден");
        $("#EmailNotification").slideDown();
        $(input).addClass("InvalidInput");
        invalidFields["Email"] = 1;
    }
    else if(inputValue.indexOf("@") == -1){
        $("#EmailNotification").html("В email адреса, който сте въвели, отсъства @");
        $("#EmailNotification").slideDown();
        $(input).addClass("InvalidInput");
        invalidFields["Email"] = 1;
    }
    else{
        $("#EmailNotification").slideUp();
        $(input).removeClass("InvalidInput");
        invalidFields["Email"] = 0;
    }

});

$("#register").on("click", function() {

    if( invalidFields["Username"] == 0 &&
        invalidFields["Password"] == 0 &&
        invalidFields["Email"] == 0){

        var userInfo = {};
        userInfo.Username = $("#username").val().trim();
        userInfo.Email = $("#email").val().trim();
        userInfo.Password = $("#password").val().trim();
        userInfo.Gender = $("input[name='gender']").val();

        console.log(userInfo);

        swal.fire({
            type: "info",
            title: "Изчакайте малко..."
        })

        $.post('/register', { userInfo: userInfo})
        .done(function(data){
            if(data.type == "success"){
                swal({
                    type: "success",
                    title: "Добре дошли!",
                    text: "Регистрацията мина успешно. Ще получите email на " + userInfo.Email + " с повече информация за новия си профил",
                    footer: "<a href='/login'>Вход</a>"
                });
            }
            else{
                if(data.text != undefined){
                    swal({
                        type: "error",
                        title: data.title,
                        text: data.text
                    });
                }
                else failMessage();
            }
        })
    }
    else{
        swal.fire({
            type: "error",
            title: "Въвели сте невалидни данни",
            text: "Прегледайте дали вашите данни отговарят на изискванията"
        })
    }



})
