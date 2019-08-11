function loadUserProgress(){
    var lastValues = [];
    var tendenicySgns = [];

    $.get({ url: "/getUserProgress" })
    .done(function(data){
        var Progress = data.Progress;
        console.log(data);
        var ProgressForChart = {bodyFatPercentage: [], weight: [], dates: []}

        for(var i = 0; i < Progress.length; i++){
            ProgressForChart.bodyFatPercentage.push(Progress[i].FatBodyMassPercentage)
            ProgressForChart.weight.push(Progress[i].Weight)
            ProgressForChart.dates.push(composeDate(Progress[i].Date))
        }

        console.log(ProgressForChart);
        // Display data in table

        $("#ProgressChart").empty();
        var progressChart = new Chart(document.getElementById('ProgressChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ProgressForChart.dates,
                datasets: [
                    {
                        label: 'Процент телесни мазнини',
                        backgroundColor: '#40b2aa',
                        borderColor: '#30a199',
                        pointBackgroundColor : '#209088',
                        data: ProgressForChart.bodyFatPercentage
                    },
                    {
                        label: 'Тегло',
                        backgroundColor: '#bed554',
                        borderColor: '#adc443',
                        pointBackgroundColor: '#9cb332',
                        data: ProgressForChart.weight
                    }
                ]
            },
            options: {
                scales: {
                    yAxes: [{
                        display: true,
                        ticks: {
                            suggestedMin: 0,
                            suggestedMax: 70
                        }
                    }]
                }
            }
        });
        elementLoading("#ProgressSection", "hide");
    })
    .fail(function(error){
        failMessage();
    });
}
