function attachClickEvent(){
    // Some cringy way to attach event to all rows but the row in THEAD
    $("tr:not([data-role='Header'] > tr)").click(function () {

        var Ingredient = getIngredientInfoFromTable($(this));

        // Determine wether a product has high Glycemic Index
        if(Ingredient.Type == "C"){
            if(typeof Ingredient.GI != "undefined"){
                if(Ingredient.GI <= 50) Ingredient.GIGrade = "low";
                else if(Ingredient.GI <= 70) Ingredient.GIGrade = "moderate";
                else Ingredient.GIGrade = "high";
            }
        }
        // Determine wether a product is Слабо, Средно or Силно saturated
        else if(Ingredient.Type != "B"){ // Balanced ingredients can't be saturated
            var MaxValueForType = MaxValue[Ingredient.Type];
            if(Ingredient.Value < MaxValueForType / 3) Ingredient.Saturation = "low";
            else if(Ingredient.Value < MaxValueForType / 3 * 2) Ingredient.Saturation = "moderate";
            else Ingredient.Saturation = "high";
        }


        // Find out if the product is good for a dietary goal
        var message = "";
        var dataType = "good";
        if(Ingredient.Type == "C"){
            if(Ingredient.GIGrade == "high") {
                message = "Минимална консумация. Източник на неблагоприятни въглехидрати.";
                dataType = "bad";
            }
            else if(Ingredient.GIGrade == "moderate") {
                message = "Да се консумира умерено";
                dataType = "warning";
            }
            else message = "Източник на благоприятни въглехидрати";
        }

        // Compose Ingredient Info HTML

        var html = '<span id="Iid" class="d-none">' + Ingredient.id + '</span>' +
        '<div id="IImage" style="background-image: url(/images/ingredientTiles/' + Ingredient.ImageName + '.png)" class="m-auto"></div>' +
        '<div id="ITitle">' + Ingredient.Name + '</div>' +
        '<div id="IType"> ' + Ingredient.TypeInBG + "</div>";


        // Contains in 100g
        if(Ingredient.Type != "B"){
            html += '<div id="IOneBlock" class="text-center">1 блок = ' + Ingredient.OneBlock + ' ' + Ingredient.Unit + '</div>' +
            '<div id="IValue" class="my-1">' +
                Ingredient.Value + 'г ' + Ingredient.TypeInBG.toLowerCase() + ' в 100г продукт' +
            '</div>';
        }
        else{
            html += '<div id="IOneBlock" class="my-1">100г продукт = ' + Ingredient.Value + ' балансирани блока</div>'
        }

        // If Carbs -> there are recommendations
        if(Ingredient.Type == "C"){
            html += '<div id="IRecommendation" class="my-1" data-type="' + dataType + '">' +
                "<b>" + message + "</b>" +
            '</div>';
        }

        // If has Glycemic Index
        if(typeof Ingredient.GI != "undefined"){
            html += '<div id="IGlycemicIndex" class="my-1"> Гликемичен индекс: ' + Ingredient.GI +'</div>';
        }

        // If User Product
        if(Ingredient.Name.indexOf("*") > -1){
            html += '<div class="my-1"> * Твой продукт</div>';
        }

        var windowWidth = $(window).width();
        // If Info is still visible
        if(windowWidth > 768){
            var Info = $("#Info");
            $(Info).empty();
            $(Info).append(html);
        }
        else{
            swal({
                title: Ingredient.Name,
                html: html,
                confirmButtonText: "Затвори"
            });
        }


    });
}
