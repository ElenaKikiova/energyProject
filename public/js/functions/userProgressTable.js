function loadUserProgressTable(reload){
    elementLoading("#ProgressSection", "show");
    var lastValues = [];
    var tendenicySgns = [];

    $.get({ url: "/getUserProgress" })
    .done(function(data){
        var Records = data.Records;
        var k = 0;
        var rows = [];
        for(var i = (Records.length - 1); i >= 0; i--){
            var Record = Records[i];
            var indexes = [Record.FatBodyMassPercentage, Record.Weight];

            // First record ever
            if(i == (Records.length - 1)){
                lastValues = indexes;
                tendenicySgns[0] = tendenicySgns[1] = "fa-play-circle";
            }
            else {
                for(var j = 0; j < indexes.length; j++){
                    if(indexes[j] > lastValues[j]) {
                        lastValues[j] = indexes[j];
                        tendenicySgns[j] = "fa-arrow-circle-up";
                    }
                    else if(indexes[j] == lastValues[j]){
                        tendenicySgns[j] = "fa-pause-circle";
                    }
                    else{
                        lastValues[j] = indexes[j];
                        tendenicySgns[j] = "fa-arrow-circle-down";
                    }
                }
            }

            var newRow = $("<tr class='Record'>" +
                "<td class='RDate'>" + Record.Date +"</td>" +
                "<td class='RFatBodyMassPercentage'>" +
                    "<div class='RNumber'>" + Record.FatBodyMassPercentage + "</div>" +
                    "<div class='RTendency fas " + tendenicySgns[0] + "'></div>" +

                "</td>" +
                "<td class='w-0'></td>" +
                "<td class='RWeight'>" +
                    "<div class='RNumber'>" + Record.Weight + "</div>" +
                    "<div class='RTendency fas " + tendenicySgns[1] + "'></div>" +
                "</td>" +
                "<td class='w-0'></td>" +
            "</tr>");

            rows[k] = newRow;
            k++;

        }

        // Display data in table

        var Table = $("#ProgressRecordsTable");

        if(reload == true) {
            $(Table).DataTable().destroy();
            $(Table).find(".Record").remove();
        }

        for(var k = rows.length - 1; k >= 0; k--){
            Table.append(rows[k]);
        }

        var dataTableOptions = {
            "ordering": false,
            "pageLength": 4,
            "paging": true,
            "oLanguage": {
                "sEmptyTable": "Няма резултати",
                "sInfo": "Намерени са _TOTAL_ записа",
                "sInfoEmpty": "Намерени са 0 записа",
                "sInfoFiltered": " от _MAX_",
                "oPaginate": {
                  "sFirst": "Първа",
                  "sLast": "Последна",
                  "sPrevious": "❰",
                  "sNext": "❱"
                }
            }
        };

        var dataTable = Table.DataTable(dataTableOptions);

        elementLoading("#ProgressSection", "hide");
    })
    .fail(function(error){
        failMessage();
    });
}
