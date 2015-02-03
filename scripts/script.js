

//write github text
//add to website (and other examples/update)
//ipad sizing
//dynamic height sizing
//center text
//up arrow
//overlay it

//post:
//grunt uncss
//grunt minify

// any other grunt tasks
// host open sans locally

//jslint/hint


//email folks!
 

(function z(){
	interactiveBuilder = {
		data:'',
		ready: function (error, data){

			$("#preloader").remove();
			$("#scroller").show();
			$("#interactive").show();
			$("#topTitle").show();

			data.forEach(function(t, i){
				t['minuteonbike'] = +t['timeminutes'];
				t['timeonbike'] = +t['tripdurationintervals'];
				t['ageonbike'] = +t['ageintervals'] - 7;
				t['degrees'] = +t['degrees'];
			});
			var formatNumber = d3.format(",d"),
      formatChange = d3.format("+,d");

			var dateFormat = d3.time.format("%Y-%m-%d %X");

			data.forEach(function(d, i) {
			  d['start station id'] = +d['start station id'];
			  d['end station id'] = +d['end station id'];
			  d['start station latitude'] = +d['start station latitude'];
			  d['end station latitude'] = +d['end station latitude'];
			  d['start station longitude'] = +d['start station longitude'];
			  d['end station longitude'] = +d['end station longitude'];
			  d.gender = +d.gender;
			});

			function formatTimeofDay(d) {
				var m;
		
				if (d === 288){
					m = 24;
				} 
				else {
					m = 12;
				}

			  if (d > 0 && d < 144 || d === 288) {
			  	return d/m + " a.m.";
			  }
			  else if (d === 0) {
			  	return d + 12 + " a.m."
			  }
			  else if (d === 144) {
			  	return d/m + " p.m.";
			  }
				else {
			  	return (d - 144)/m + " p.m.";
			  }
			}

			var rides = crossfilter(data),
	      all = rides.groupAll(),
	     
	      hour = rides.dimension(function(d) { return d.minuteonbike; }),
	     	hours = hour.group(),

	      gender = rides.dimension(function(d) { return d.gender; }),
	      genderCheck = rides.dimension(function(d) { return d.gender; }),
				gendersAvg = gender.group().reduce(reduceAddGender, reduceRemoveGender, reduceInitialGender).all(),

				dimensionStartStationEndLat = rides.dimension(function (d) {
					return +d['start station id'];
				}),
				dimensionsAvg = dimensionStartStationEndLat.group().reduce(reduceAddLat, reduceRemoveLat, reduceInitialLat).all(),

				degree = rides.dimension(function(d) { return d.degrees; }),
				degrees = degree.group(),

	      borough = rides.dimension(function(d) { return d.borough; }),
	      boroughCheck = rides.dimension(function(d) { return d.borough; }),
				boroughsAvg = borough.group().reduce(reduceAddBorough, reduceRemoveBorough, reduceInitialBorough).all(),

	      duration = rides.dimension(function(d) { return d.timeonbike; }),
	      durations = duration.group(),
	      duration2 = rides.dimension(function(d) { return d.timeonbike; }),
	      durationsAvg = duration2.groupAll().reduce(reduceAddDuration, reduceRemoveDuration, reduceInitialDuration).value(),
	      
	      age = rides.dimension(function(d) { return d.ageonbike; }),
	      ages = age.group(),

	      age2 = rides.dimension(function(d) { return d.ageonbike; }),
	      agesAvg = age2.groupAll().reduce(reduceAddAge, reduceRemoveAge, reduceInitialAge).value();

    	var format = d3.format(",.4f");
    	var charts = [

		    barChart()
		      .dimension(hour)
		      .group(hours)
		      .tickFormat(formatTimeofDay)
		      .barwidth(2)
		      .tickF([0,24,48,72,96,120,144,168,192,216,240,264,288]
    			)
    			.y(d3.scale.linear().range([80, 0]))
		    	.x(d3.scale.linear()
		      .domain([0,288])
		      .rangeRound([0, 288*3]))
		  ]

			cCharts = [
				circleChart()
					.dimension(duration)
					.group(durations)
					.chartName('duration')
					.label(['0m','15m','30m','45m']),


				circleChart()
					.dimension(degree)
					.group(degrees)
					.chartName('direction')
					.label(['N', 'E','S', 'W']),

				circleChart()
					.dimension(age)
					.group(ages)
					.chartName('age')
					.label(['15y', '30y','45y', '60y'])
			]

		  var chartz = d3.selectAll(".chart")
	      .data(charts)
	      .each(function(chartz) { chartz.on("brush", renderAll).on("brushend", renderAll); });

			var cChart = d3.selectAll(".cChart")
					.data(cCharts)
					.each(function(chart){ chart.on("brush", renderAll).on("brushend", renderAll) });
		  
		  d3.selectAll("#total")
		    .text(formatNumber(rides.size()));

		  function menRatio(avgs) {
		  	if (typeof avgs === undefined) {
		  		return "z"
		  	}
		  	var avg = avgs[0]['value']['count'] / avgs[1]['value']['count'];
		  	if (isFinite(avg)) {
		  		return Number(avg).toFixed(1);
		  	} 
		  	else {
		  		return 0.0;
		  	}
		  }

		  function boroughRatio(avgs) {
		  	if (typeof avgs === undefined) {
		  		return "z"
		  	}
		  	var avg = avgs[1]['value']['count'] / avgs[0]['value']['count'];
		  	if (isFinite(avg)) {
		  		return Number(avg).toFixed(1);
		  	} 
		  	else {
		  		return 0;
		  	}
		  }

		  function durationAv(avgs){
		  	var avg = avgs['average'];
		  	if (isNaN(avg)) {
		  		return "0"
		  	} 
		  	else {
		  		return Number(avg*2).toFixed(1);
		  	}
		  }

		  function ageAv(avgs){
		  	var avg = avgs['average'];
		  	if (isNaN(avg)) {
		  		return "0"
		  	} 
		  	else {
		  		return Number((avg + 7)*2).toFixed(1);
		  	}
		  }

		  $.ajax({
			  url: "./../map.js",
			  dataType: "script",
			  success:startMap
			});

			function startMap() {
			  renderAll();
			}
		  function render(method) {
		    d3.select(this).call(method);
		  }

		  function renderAll() {
		  
		    chartz.each(render);

				cChart.each(render);
		    d3.select("#active").text(formatNumber(all.value()));
		    d3.select("#menTo").text(menRatio(gendersAvg));
		    d3.select("#minsSpent").text(durationAv(durationsAvg));
		    d3.select("#yearsOld").text(ageAv(agesAvg));
		    d3.select("#manTo").text(boroughRatio(boroughsAvg))

		    layMap.drawMap(dimensionsAvg);
		  }
		  
			window.filter = function(filters) {
		    filters.forEach(function(d, i) { charts[i].filter(d); });
		    renderAll();
		  };

		  window.breset = function(i){
				charts[i].filter(null);
				zoomRender = true;
				renderAll();
			}
			window.creset = function(i){
				cCharts[i].filter(null);
				zoomRender = true;
				renderAll();
			}

		  function updateFilters(z,o) {
		  	genderCheck.filterFunction(function(d){ return d === parseInt(z[1],10) || d === parseInt(z[0],10) });
		  	gendersAvg.filter(function(d){ return d === parseInt(z[1],10) || d === parseInt(z[0],10) });
		  	boroughCheck.filterFunction(function(d){ return d === z[2] || d === z[3] });
		  	//boroughsAvg.filterFunction(function(d){ return d === z[2] || d === z[3] });
		  	renderAll();
		  	if( z[0] === null || z[1] === null) {
		    	d3.select("#menTo").html("-");
		    	d3.select("#womenTo").html("-");
		  	} else{
		    	d3.select("#womenTo").html("1");
		  	}
		  	if( z[2] === null || z[3] === null ) {
		    	d3.select("#manTo").html("-");
		    	d3.select("#brookTo").html("-");
		  	}
		  	else{
		  		d3.select("#brookTo").html("1");
		  	}
		  }

		  function checkFilters(z) {
		  	var checksVals = [null,null,null,null]
		  	var checks = ["#womenSelect","#menSelect","#manSelect","#brookSelect"];
		  	
		  	for (i=0;i<checksVals.length;i++){
		  		var k = $(checks[i]).attr('data-val');
		  		if (k & 1) {
			  		var j = $(checks[i]).attr('name');
						checksVals[i] = j;
			  	}
			  }

		  	updateFilters(checksVals,z)
		  }

		  (function domHandlers() {
				$('#checkFilters :checkbox').change(function(e) {
	    		var id = '#' + e['currentTarget']['id'];
	    		checkedId = $(id);
   				var i = parseInt(checkedId.attr('data-val'),10);
	        checkedId.attr('data-val', i + 1);
	        var j = parseInt(checkedId.attr('data-val'),10);
	        var z = checkedId.attr('cat');
	        return checkFilters(z);
	    	});

	    	
			})()

			return ;
		},
		start: function (){

			queue()
	    .defer(d3.csv,"./dataset/dataset5.csv")
	    .await(interactiveBuilder.ready);

		}
	}
})()