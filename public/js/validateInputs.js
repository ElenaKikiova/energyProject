// Validate all text inputs for forbiden characters

$("input[type='text']").keyup(function(){
    var input = $(this);
    var inputValue = input.val();

    var forbidenChars = ['"', '\\', ';', '{', '=', '$', '[', ']', '}', '<', '>'];

    for(var i = 0; i < forbidenChars.length; i++){
        if(inputValue.indexOf(forbidenChars[i]) != -1){
            input.val(inputValue.replace(forbidenChars[i], ""));
            swal({
                type: "warning",
                title: "Неразрешен символ",
                text: "Въвели сте неразрешен символ " + forbidenChars[i] + " , който ще бъде изтрит."
            });
        }
    }
});

// All numbers
$("input[type='number']").on("keyup, change", function(){
    var input = $(this);
    var inputValue = parseInt(input.val());
    if(inputValue != "." & inputValue < 0) input.val(0);
    if($(input).attr("id") == "RecipeBlocks"){
        if(inputValue < 1) input.val(1);
    }
});

// Validate Ingredient Nutrients

$("input[data-field='contains']").on("keyup, change", function(){
    var input = $(this);
    var inputValue = parseInt(input.val());
    if(inputValue < 0) input.val(0);
});
