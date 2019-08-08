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

        var k = parseFloat($("#blocksPerDay").html());

        for(var i = 0; i < Blocks.length; i++){
            BlocksForChart.blocks.push(Blocks[i].Blocks)
            BlocksForChart.dates.push(Blocks[i].Day + "." + Blocks[i].Month + "." + Blocks[i].Year);
            if(Blocks[i].Blocks < 11) BlocksForChart.colors[i] = "red";
            else if(Blocks[i].Blocks > 17) BlocksForChart.colors[i] = "blue";
            else BlocksForChart.colors[i] = "hsl(" + Blocks[i].Blocks * k +  ", 70%, 50%)";
            console.log(Blocks[i].Blocks * k, k);

        }

        for(var i = 0; i < Progress.length; i++){
            ProgressForChart.bodyFatPercentage.push(Progress[i].FatBodyMassPercentage)
            ProgressForChart.weight.push(Progress[i].Weight)
            ProgressForChart.dates.push(Progress[i].Date)

        }

        console.log(BlocksForChart, ProgressForChart);

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
            }
        });

        var progressChart = new Chart(document.getElementById('ProgressChart').getContext('2d'), {
            type: 'line',
            data: {
                labels: ProgressForChart.dates,
                datasets: [
                    {
                        label: 'Процент телесни мазнини',
                        backgroundColor: 'rgb(100, 100, 200)',
                        borderColor: 'rgb(100, 100, 200)',
                        data: ProgressForChart.bodyFatPercentage
                    },
                    {
                        label: 'Тегло',
                        backgroundColor: 'rgb(160, 130, 200)',
                        borderColor: 'rgb(160, 130, 200)',
                        data: ProgressForChart.weight
                    }
                ]
            }
        });

        elementLoading("#ProgressSection", "hide");
    })
    .fail(function(error){
        failMessage();
    });
}
