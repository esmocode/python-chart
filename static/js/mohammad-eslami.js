// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';



//Return Sensor Labels -----------------------
getLabels = () => {
	let labels = [];
	for (let i = 0; i < 10; i++) {
		labels.push("sensor" + i)
	}
	return labels;
}

//Get sensor data for each sample -------------
getSampleData = (sampleIndex, data) => {
	let sampleData = [];
	for (let i = 0; i < 10; i++) {
		sampleData.push(data.sensor_data["sensor" + i][sampleIndex])
	}
	return sampleData;
}

//Get Sample Name ---------------------------
getSampleLabel = (index) => {
	return "Sample" + index;
}


//Get Random Color ---------------------------
getRandomColor = () => {
	var letters = '0123456789ABCDEF';
	var color = '#';
	for (var i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}

getDataSet = (selectedArray, data) => {
	let sets = [];
	selectedArray.map(x => {
		sets.push({
			fill: false,
			label: getSampleLabel(x),
			backgroundColor: 'transparent',
			borderColor: getRandomColor(),
			data: getSampleData(x, data)
		})
	});

	return sets;
}

var config = {
	type: 'line',
	data: {
		labels: getLabels(),
		datasets: []
	},
	options: {
		maintainAspectRatio: false,
		layout: {
			padding: {
				left: 10,
				right: 25,
				top: 25,
				bottom: 0
			}
		},
		tooltips: {
			titleMarginBottom: 10,
			titleFontColor: '#6e707e',
			titleFontSize: 14,
			backgroundColor: "rgb(255,255,255)",
			bodyFontColor: "#858796",
			borderColor: '#dddfeb',
			borderWidth: 1,
			xPadding: 15,
			yPadding: 15,
			displayColors: false,
			caretPadding: 10,
			callbacks: {
				label: function (tooltipItem, data) {
					let datasetLabel = data.datasets[tooltipItem.datasetIndex].label || '';
					let sampleData = data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index]
					return datasetLabel + " : " + sampleData;
				}
			}
		},
	}
};

// Area Chart Example
(async () => {

	var ctx = document.getElementById("myAreaChart");
	var data = await fetch("/data").then(response => response.json()).then(res => { return res });

	//SelectBox ----------------------------------------------
	sampleSelect = document.getElementById('sampleSelect');
	for (let i = 0; i < data.sensor_data["sample index"].length; i++) {
		sampleSelect.options[sampleSelect.options.length] = new Option(getSampleLabel(i), i);
	}

	//Onload data sample 1,2,3--------------------------------
	sampleSelect.remove(0); 
	sampleSelect.options[0].selected = true;
	sampleSelect.options[1].selected = true;
	sampleSelect.options[2].selected = true;
	config.data.datasets = getDataSet([0, 1, 2], data);

	sampleSelect.onchange = () => {
		var selectedSamples = [];
		for (var i = 0; i < sampleSelect.length; i++) {
			if (sampleSelect.options[i].selected) selectedSamples.push(sampleSelect.options[i].value);
		}
		if (sampleSelect.length) {
			config.data.datasets = getDataSet(selectedSamples, data);
			window.myLineChart.update();
		}
	};
	/*************************** End ****************************/

	window.myLineChart = new Chart(ctx, config);

})();