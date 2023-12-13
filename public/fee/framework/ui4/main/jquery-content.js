var randomScalingFactor = function() {
	return Math.round(Math.random() * 50)
};
var lineChartData = {
	labels : [ "January", "February", "March", "April", "May", "June", "July" ],
	datasets : [ {
		label : "My First dataset",
		fillColor : "rgba(139,201,154,0)",
		strokeColor : "rgba(122,193,255,1)",
		pointColor : "rgba(122,193,255,1)",
		pointStrokeColor : "#fff",
		pointHighlightFill : "#fff",
		pointHighlightStroke : "rgba(220,220,220,1)",
		data : [ randomScalingFactor(), randomScalingFactor(),
				randomScalingFactor(), randomScalingFactor(),
				randomScalingFactor(), randomScalingFactor(),
				randomScalingFactor() ]
	} ]

};

(function(config) {
	config["scaleFontColor"] = "#fff";
})(Chart.defaults.global);
$(document).ready(function() {

	var ctx = document.getElementById("mycharts").getContext("2d");
	window.myLine = new Chart(ctx).Line(lineChartData, {
		responsive : true
	});

});

var randomScalingFactor = function() {
	return Math.round(Math.random() * 50)
};

var barChartData = {
	labels : [ "January", "February", "March", "April", "May", "June", "July" ],
	datasets : [ {
		fillColor : "rgba(173,135,252,1)",
		strokeColor : "rgba(173,135,252,1)",
		highlightFill : "rgba(173,135,252,.5)",
		highlightStroke : "rgba(173,135,252,.5)",
		data : [ randomScalingFactor(), randomScalingFactor(),
				randomScalingFactor(), randomScalingFactor(),
				randomScalingFactor(), randomScalingFactor(),
				randomScalingFactor() ]
	} ]

};
(function(config) {
	config["scaleFontColor"] = "#fff";
})(Chart.defaults.global);
$(document).ready(function() {
	var ctx = document.getElementById("bmp-bar").getContext("2d");
	window.myBar = new Chart(ctx).Bar(barChartData, {
		responsive : true
	});
});