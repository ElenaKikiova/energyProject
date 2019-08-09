function loadUserProgressChart(reload){
    var lastValues = [];
    var tendenicySgns = [];

    $.get({ url: "/getUserProgress" })
    .done(function(data){
        var Progress = data.Progress;
        var Blocks = data.Blocks;
        console.log(data);

        var BlocksForChart = {blocks: [], dates: [], colors: []};
        var ProgressForChart = {bodyFatPercentage: [], weight: [], dates: []}
        var Current = {};

        var k = parseFloat($("#blocksPerDay").html());

        Current.avgDailyBlocks = 0;

        for(var i = 0; i < Blocks.length; i++){
            BlocksForChart.blocks.push(Blocks[i].Blocks)
            BlocksForChart.dates.push(Blocks[i].Day + "." + Blocks[i].Month + "." + Blocks[i].Year);
            if(Blocks[i].Blocks < 11) BlocksForChart.colors[i] = "grey";
            else if(Blocks[i].Blocks > 17) BlocksForChart.colors[i] = "grey";
            else BlocksForChart.colors[i] = "hsl(" + Blocks[i].Blocks * k +  ", 70%, 70%)";
            Current.avgDailyBlocks += Blocks[i].Blocks;
        }

        for(var i = 0; i < Progress.length; i++){
            ProgressForChart.bodyFatPercentage.push(Progress[i].FatBodyMassPercentage)
            ProgressForChart.weight.push(Progress[i].Weight)
            ProgressForChart.dates.push(composeDate(Progress[i].Date))
        }


        Current.avgDailyBlocks = Math.round(Current.avgDailyBlocks / Blocks.length);
        Current.weight = ProgressForChart.weight[ProgressForChart.weight.length - 1];
        Current.bodyFatPercentage = ProgressForChart.bodyFatPercentage[ProgressForChart.bodyFatPercentage.length - 1];

        console.log(BlocksForChart, ProgressForChart, Current);

        $("#avgDailyBlocks").html(Current.avgDailyBlocks);
        $(".dataCard#weight>.value>.digit").html(Math.round(Current.weight));
        $(".dataCard#bodyFatPercentage>.value>.digit").html(Current.bodyFatPercentage);

        // Display data in table

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
