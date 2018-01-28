var dp = [100, 200, 300, 200, 100, 150, 120, 122, 50, 302, 480, 100];
window.onload = function () {

	dpedited = [];
	for (var i = 0; i < dp.length; i++){
		dpedited.push({y:dp[i]});
	}
	console.log(dpedited);
	var chart = new CanvasJS.Chart("chartContainer", {
		animationEnabled: true,
		theme: "light2",
		title:{
			text: "Emotion"
		},
		axisY:{
			includeZero: false
		},
		data: [{        
			type: "line",       
			dataPoints: dpedited

			/*[
				{ y: dp[0] },
				{ y: dp[1] },
				{ y: dp[2] },
				{ y: 460 },
				{ y: 450 },
				{ y: 500 },
				{ y: 480 },
				{ y: 480 },
				{ y: 410 },
				{ y: 500 },
				{ y: 480 },
				{ y: 510 }
			]*/
		}],
	});
	chart.render();

}