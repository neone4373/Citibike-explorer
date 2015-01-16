//http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/

//data processing: one of stations is missing; duration/age limits

//1. ratios with donut charts
//2. radial chart
//3. project the lines on the map
//4. design + style + headline


(function z(){
	interactiveBuilder = {
		data:'',
		domHandlers: function() {

	    

		},
		formatDuration: function(d) {
				return (d / 60) + " mins";
		},
		ready: function (error, data){


			var drawPie = (function () {

				var width = 150,
				    height = 150;

				var svg = d3.select("#genderPie").append("svg")
				    .attr("width", width)
				    .attr("height", height)
				  .append("g")
				    .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

				function svgR() {	
					return svg;
				}

		    return {
		    	svgV:svgR
		    };

		  })();

			var formatNumber = d3.format(",d"),
      formatChange = d3.format("+,d");

			var dateFormat = d3.time.format("%Y-%m-%d %X");

			data.forEach(function(d, i) {
			  d.index = i;
			  d.tripduration = +d.tripduration;
			  d.starttime = dateFormat.parse(d.starttime);
			  d.stoptime = dateFormat.parse(d.stoptime);
			  d['start station id'] = +d['start station id'];
			  d['end station id'] = +d['end station id'];
			  d['start station latitude'] = +d['start station latitude'];
			  d['end station latitude'] = +d['end station latitude'];
			  d['start station longitude'] = +d['start station longitude'];
			  d['end station longitude'] = +d['end station longitude'];
			  d.gender = +d.gender;
			  d.age = +d.age;
			});

			function formatTimeofDay(d) {
				var m;
		
				if (d === 1440){
					m = 120;
				} 
				else {
					m = 60;
				}

			  if (d > 0 && d < 720 || d === 1440) {
			  	return d/m + " a.m.";
			  }
			  else if (d === 0) {
			  	return d + 12 + " a.m."
			  }
			  else if (d === 720) {
			  	return d/m + " p.m.";
			  }
				else {
			  	return (d - 720)/m + " p.m.";
			  }
			}


			var rides = crossfilter(data),
	      all = rides.groupAll(),
	      /*startTime = rides.dimension(function(d) { return d.starttime; }),
	      startTimes = startTime.group(d3.time.day),*/
	      hour = rides.dimension(function(d) { 
	      	return (d.starttime.getHours() * 60) + (d.starttime.getMinutes()); 
	      }),
	      hours = hour.group(function(d) { return Math.floor(d / 3)*3; });
	      gender = rides.dimension(function(d) { return d.gender; }),
	      genders = gender.group(),
				gendersAvg = gender.group().reduce(reduceAddGender, reduceRemoveGender, reduceInitialGender).all(),

				endstationPathLong = rides.dimension(function(d) { return d['end station longitude']; }),
				endstationPathLat = rides.dimension(function(d) { return d['end station latitude']; }),
				endstationPathLongAvg = endstationPathLong.group().reduce(reduceAddLong, reduceRemoveLong, reduceInitialLong).all(),
				endstationPathLatAvg = endstationPathLat.group().reduce(reduceAddLat, reduceRemoveLat, reduceInitialLat).all(),

	      borough = rides.dimension(function(d) { return d.borough; }),
	      boroughs = borough.group(),
				boroughsAvg = borough.group().reduce(reduceAddBorough, reduceRemoveBorough, reduceInitialBorough).all(),

	      startstation = rides.dimension(function(d){return d['start station id']; }),
				startstationsAvg = startstation.group().reduce(reduceAdd, reduceRemove, reduceInitial).all(),

	      duration = rides.dimension(function(d) { return d.tripduration; }),
	      durations = duration.group(function(d) { return Math.floor(d / 10) * 10; }),
	      durationsAvg = duration.groupAll().reduce(reduceAddDuration, reduceRemoveDuration, reduceInitialDuration).value(),
	      
	      age = rides.dimension(function(d) { return d.age; }),
	      ages = age.group(function(d) { return Math.floor(d / 10) * 10; }),
	      ages2 = duration.group(),
	      agesAvg = age.groupAll().reduce(reduceAddAge, reduceRemoveAge, reduceInitialAge).value();

	     var charts = [

		    barChart()
		      .dimension(hour)
		      .group(hours)
		      .tickFormat(formatTimeofDay)
		      .barwidth(1.5)
		      .tickF([0,120,240,360,480,600,720,840,960,1080,1200,1320,1440,1560]
    			)
    			.y(d3.scale.linear().range([120, 0]))
		    	.x(d3.scale.linear()
		      .domain([0,1440])
		      .rangeRound([0, (1440*2)/3])),

		    barChart()
		      .dimension(duration)
		      .group(durations)
		      .tickFormat(interactiveBuilder.formatDuration)
		      .barwidth(1.5)
		      .tickF([60,360,900,1800,2700,3600]
    			)
    			.y(d3.scale.linear().range([80, 0]))
		    	.x(d3.scale.linear()
		      .domain([60,3600])
		      .rangeRound([0, (3540*2)/10])),

		      barChart()
		      .dimension(age)
		      .group(ages)
		      .barwidth(14)
		      .tickF([0,10,30,50,70,80])
		    	.y(d3.scale.linear().range([80, 0]))
		    	.x(d3.scale.linear()
		      .domain([0,80])
		      .rangeRound([0, (80*15)/10])),
		  ]


	cCharts = [
		circleChart()
			.dimension(age)
			.group(ages2)
			.label(['10', '28','60', '80'])
	]

		  var chartz = d3.selectAll(".chart")
	      .data(charts)
	      .each(function(chartz) { chartz.on("brush", renderAll).on("brushend", renderAll); });

			var cChart = d3.selectAll(".cChart")
					.data(cCharts)
					.each(function(chart){ chart.on("brush", renderAll).on("brushend", renderAll) });
		  
		  // Render the total.
		  d3.selectAll("#total")
		    .text(formatNumber(rides.size()));

		  function menRatio(avgs) {
		  	if (typeof avgs === undefined) {
		  		return "z"
		  	}
		  	var avg = avgs[1]['value']['count'] / avgs[2]['value']['count'];
		  	if (isFinite(avg)) {
		  		return d3.round(avg,2);
		  	} 
		  	else {
		  		return 0;
		  	}
		  }

		  function boroughRatio(avgs) {
		  	if (typeof avgs === undefined) {
		  		return "z"
		  	}
		  	var avg = avgs[1]['value']['count'] / avgs[0]['value']['count'];
		  	if (isFinite(avg)) {
		  		return d3.round(avg,2);
		  	} 
		  	else {
		  		return 0;
		  	}
		  }

		  function durationAv(avgs){
		  	var avg = avgs['average'] / 60;
		  	if (isNaN(avg)) {
		  		return "0"
		  	} 
		  	else {
		  		return d3.round(avg,1)
		  	}
		  }

		  function ageAv(avgs){
		  	var avg = avgs['average'];
		  	if (isNaN(avg)) {
		  		return "0"
		  	} 
		  	else {
		  		return d3.round(avg,1)
		  	}
		  }

		  var circleGender = (function() {
		  	//thank you Bostock http://bl.ocks.org/mbostock/1346410
				var radius = Math.min(120, 120) / 2;

				var color = d3.scale.category20();

				var pie = d3.layout.pie().value(function(d){ return d; }).sort(null);
				var arc = d3.svg.arc()
				    .innerRadius(radius - 30)
				    .outerRadius(radius - 20);
				var dataPie = [gendersAvg[1]['value']['count'],gendersAvg[2]['value']['count']];
		  	var gX = drawPie.svgV().append('g');
		  	var gX = drawPie.svgV().append('g');
		  	var path = gX.datum(dataPie).selectAll("path").data(pie).enter()
			   .append("path").attr("class",'piechart')
			      .attr("fill", function(d, i) { return color(i); })
			      .attr("d", arc)
			      .each(function(d) { this._current = d; }); // store the initial angles

		    function arcTween(a) {
				  var i = d3.interpolate(this._current, a);
				  this._current = i(0);
				  return function(t) {
				    return arc(i(t));
				  };
				}

			  function change() {
			  	var men = gendersAvg[1]['value']['count'];
			  	var women = gendersAvg[2]['value']['count'];
					var dataPie = [men,women];
					if (men === 0 || women === 0){
						dataPie = [1,0];
					}
  				gX.datum(dataPie).selectAll("path").data(pie).transition().duration(250).attrTween("d", arcTween)
					
					gX.datum(dataPie).selectAll("path")
					    .data(pie)
					  .enter().append("path")
					    .attr("class","piechart")
					    .attr("fill", function(d,i){ return color(i); })
					    .attr("d", arc)
					    .each(function(d){ this._current = d; })

				  gX.datum(dataPie).selectAll("path")
				    .data(pie).exit().remove();
					
			  }
			  return {
			  	change:change
			  }
			})()
				// Store the displayed angles in _current.
				// Then, interpolate from _current to the new angles.
				// During the transition, _current is updated in-place by d3.interpolate.
				


		  renderAll();
		  // Renders the specified chart or list.
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

		    circleGender.change();
		  }
		  
			window.filter = function(filters) {
		    filters.forEach(function(d, i) { charts[i].filter(d); });
		    renderAll();
		  };/*
		  window.reset = function(i) {
		    charts[i].filter(null);
		    renderAll();
		  };*/

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
		  	gender.filterFunction(function(d){ return d === parseInt(z[1]) || d === parseInt(z[0]) });
		  	test = gendersAvg.filter(function(d){ console.log(d); return d === parseInt(z[1]) || d === parseInt(z[0]) });
		  	console.log(test);
		  	borough.filterFunction(function(d){ return d === z[2] || d === z[3] });
		  	renderAll();
		  	if( z[1] === null || z[0] === null ) {
		    	d3.select("#menTo").html("&#8734");
		  	}
		  	if( z[2] === null || z[3] === null ) {
		    	d3.select("#manTo").html("&#8734");
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
   				var i = parseInt(checkedId.attr('data-val'));
	        checkedId.attr('data-val', i + 1);
	        var j = parseInt(checkedId.attr('data-val'));
	        var z = checkedId.attr('cat');
	        return checkFilters(z);
	    	});
			})()

			//return ;
			return ;
		},
		start: function (){

			queue()
	    .defer(d3.csv,"./dataset/dataset.csv")
	    .await(interactiveBuilder.ready);

		}
	}
})()