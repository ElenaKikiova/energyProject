

$("#Calculate").click(function(){
    var Gender = $("#Gender").html();
    var Weight = parseFloat($("#Weight").val());
    var Measures = [];
    var MeasureInputs = $("[data-type='measure']");
    var Constants = [];
    var areEmpty = 0;
    var areNotValid = 0;

    var PhActivity = parseFloat($("#SelectPhActivity option:selected").val());

    for(var i = 0; i < MeasureInputs.length; i++){
        var currentInput = $(MeasureInputs[i]).val();
        if(currentInput.length != 0) {
            if(parseFloat(currentInput) > 10){
                Measures[i] = convertToInches($(MeasureInputs[i]).val());
            }
            else areNotValid++;
        }
        else areEmpty++;
    }

    if(
        areEmpty == 0 &&
        PhActivity != 0
    ){

        if(areNotValid == 0){
            if(Gender == "F"){
                var Height = convertToInches($("#Height").val());
                $.get('/getConstants?Gender=F&Measures=' + Measures)
                .done(function(data){
                    if(data.Error != null){
                        swal({
                            title: data.Error,
                            type: "error"
                        })
                    }
                    else{
                        Constants[0] = data[String(Measures[0])];

                        if(
                            typeof Constants[0] == "undefined" ||
                            Measures[1] < 20 ||
                            Measures[1] > 50 ||
                            Measures[2] < 55 ||
                            Measures[2] > 76
                        ){
                            swal({
                                type: "error",
                                title: "Нестандартни мерки",
                                text: "В базата ни данни няма такива мерки. Убедете се, че правите измерванията правилно"
                            })
                        }
                        else{
                            Constants[1] = parseFloat((Measures[1] / 1.406).toFixed(2));

                            Constants[2] = parseFloat((Height / 1.640).toFixed(2));
                            console.log(Constants);
                            calcBodyMass("F", Constants, Measures, Weight, PhActivity);
                        }
                    }
                })

            }
            else{
                var WeightFormatted = Math.ceil(convertToLb(Weight) / 5) * 5;
                $.get('/getConstants?Gender=M&Measures=' + Measures + '&Weight=' + WeightFormatted)
                .done(function(data){
                    if(data.Error != null){
                        swal({
                            title: data.Error,
                            type: "error"
                        })
                    }
                    else{
                        var Proportion = Measures[0] - Measures[1];
                        Constants[0] = data[Proportion];
                        console.log(data);
                        console.log(Proportion, Constants[0]);
                        if(typeof Constants[0] != "undefined"){
                            calcBodyMass("M", Constants, Measures, Weight, PhActivity);
                        }
                        else{
                            swal({
                                type: "error",
                                title: "Нестандартни мерки",
                                text: "В базата ни данни няма такива мерки. Убедете се, че правите измерванията правилно"
                            })
                        }
                    }
                });

            }

        }
        else{
            swal({
                title: "Въвели сте невалидна стойност ( < 10 )",
                text: "Всички измервания се правят в см!",
                type: "error"
            })
        }
    }
    else{
        swal({
            title: "Всички полета са задължителни!",
            type: "error"
        })
    }

});

function calcBodyMass(Gender, Constants, Measures, Weight, PhActivity){
    // Calculate FatBodyMassPercentage
    var FatBodyMassPercentage = 0;
    if(Gender == "F") FatBodyMassPercentage = parseInt(Constants[0] + Constants[1] - Constants[2]);
    else FatBodyMassPercentage = parseInt(Constants[0]);

    // Calculate LeanBodyMass weight in Lb, to use for DaylyProteinIntakeInGr
    var LeanBodyMassWeightInLb = convertToLb(Weight - (Weight * FatBodyMassPercentage / 100));
    // Dayly Protein Intake in grams
    var DaylyProteinIntakeInGr = LeanBodyMassWeightInLb * PhActivity;
    // Convert gr to protein blocks
    var BlocksPerDay = calcHowManyBlocks("P", DaylyProteinIntakeInGr);

    if(Gender == "F" && BlocksPerDay <= 11) BlocksPerDay = 11;
    else if(Gender == "M" && BlocksPerDay <= 14) BlocksPerDay = 14;

    $("#FatBodyMassPercentage").html(FatBodyMassPercentage);
    $("#LeanBodyMassPercentage").html(100 - FatBodyMassPercentage);
    $("#BlocksPerDay").html(BlocksPerDay);

    var SaveResultsButton = $("#SaveResults");
    if($(SaveResultsButton).length > 0){
        var CalculateButton = $("#Calculate");

        // Hide Calculate and show SaveResults button
        $(CalculateButton).slideUp(300);
        $(SaveResultsButton).slideDown(300);

        function ShowCalclulateButtonBack(){
            // Hide SaveResults and show Calculate button
            $(SaveResultsButton).slideUp(300);
            $(CalculateButton).slideDown(300);
        }

        $("input").keyup(ShowCalclulateButtonBack);
        $("select").change(ShowCalclulateButtonBack);
    }
}

$("#SaveResults").click(function(){
    var Weight = $("#Weight").val();
    var BlocksPerDay = $("#BlocksPerDay").html();
    var FatBodyMassPercentage = $("#FatBodyMassPercentage").html();
    $.post('/saveUserInfo', {Weight: Weight, BlocksPerDay: BlocksPerDay, FatBodyMassPercentage: FatBodyMassPercentage})
    .done(function(){
        swal({
            type: "success",
            title: "Резултатите са добавени"
        })
        loadUserProgressTable(true);
    })
    .fail(function(){
        swal({
            type: "error",
            title: "Възкинка грешка при записването на резултатите",
            text: "Моля пробвайте пак по-късно",
            footer: '<a href="mailto:energyproject2019@gmail.com">Свържете се с администратор</a>'
        });
    });
});
