
function maintainBalance(mode){

    var blockSum = 0;

    var MealBlocks = $("#MealBlocks").val();
    var Notification = $("#Notification");

    var Unbalanced = [];

    var currentType;
    var SumBlocks = [];
    var n = 0;
    for(var i = 0; i < IngredientTypes.length; i++){
        currentType = IngredientTypes[i];

        // If mode is Dish, blockSum = dish blocks + added blocks
        blockSum = Blocks[IngredientTypes[i]];
        if(typeof DishBlocks !="undefined") blockSum += DishBlocks[i];
        SumBlocks[i] = parseFloat((blockSum).toFixed(1));
        console.log(SumBlocks[i]);

        if(SumBlocks[i] != MealBlocks) {
            Unbalanced[n] = {};
            Unbalanced[n].Type = currentType;
            Unbalanced[n].Blocks = (MealBlocks - SumBlocks[i]).toFixed(1);
            n++;
        }
        else{
            $(".BalanceTip[data-ingredient-type='" + IngredientTypes[i] + "']").slideUp(300);
        }
    }


    if(Unbalanced.length > 0){

        $(Notification).attr("data-is-balanced", "false");
        $(Notification).html("Това ястие не е балансирано!");
        $(Notification).slideDown(300);


        for(var i = 0; i < Unbalanced.length; i++){

            var BalanceTip = $(".BalanceTip[data-ingredient-type='" + Unbalanced[i].Type + "']");

            var content;
            Unbalanced[i].Blocks > 0 ?
                content = "Добавете <b>" + Unbalanced[i].Blocks + " бл </b>" :
                content = "Намалете c <b>"+ Math.abs(Unbalanced[i].Blocks) + " бл </b>";
            $(BalanceTip).html(content);
            $(BalanceTip).slideDown();

        }

    }

    if(Unbalanced.length == 0){
        $(Notification).attr('data-is-balanced', 'true');
        $(Notification).html("Ястието е балансирано!");
        $(".BalanceTip").slideUp(300);
        workplaceActionButtons(true);
    }
    else{
        workplaceActionButtons(false);
    }

    // Update SumBlocks
    for(var i = 0; i < IngredientTypes.length; i++){ // Display all ingredient types' blocks sum
        // If mode is Dish, blockSum = dish blocks + added blocks
        blockSum = Blocks[IngredientTypes[i]];
        if(typeof DishBlocks !="undefined") blockSum += DishBlocks[i];
        $(".SumBlocks[data-sum-type='" + IngredientTypes[i] + "']").html((blockSum).toFixed(1));
    }


}
