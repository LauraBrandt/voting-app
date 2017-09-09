window.onload = function() {
    var poll = JSON.parse(document.getElementById("pollData").value);
    
    var votes = [];
    var backgroundColors = [];
    var borderColors = [];
    for (var i=0; i<poll.answers.length; i++) {
        votes.push(poll.resultsObject[poll.answers[i]]);
        backgroundColors.push(getRandomColor());
        borderColors.push('rgba(0,0,0,0.7)');
    }
    
    var ctx = document.getElementById("resultsChart").getContext("2d");
    Chart.defaults.global.defaultFontSize = 14;
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: poll.answers,
            datasets: [{
                label: '# of Votes',
                data: votes,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    ticks: {
                        autoSkip: false
                    }
                }],
                yAxes: [{
                    scaleLabel: {
                        display: true,
                        labelString: '# of Votes',
                        fontSize: 16
                    },
                    ticks: {
                        beginAtZero:true,
                        stepSize: 1
                    }
                }]
            },
            animation: {
                 duration: 500
            }

        }
    });

};

function getRandomColor () {
    var red = Math.floor(Math.random()*256);
    var green = Math.floor(Math.random()*256);
    var blue = Math.floor(Math.random()*256);
    
    return 'rgba(' + red + ',' + green + ',' + blue + ', 0.7)';
}