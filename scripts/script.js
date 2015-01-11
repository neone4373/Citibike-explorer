//understand method
//review all code

//slider for one day, with station vectors changing by hour
// brushes + stacked area for age by five year intervals

//http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/


(function z(){
	interactiveBuilder = {
			data:'',
		formatDuration: function(d) {
				return (d / 60) + " mins";
		},
		ready: function (error, data){

			////2014-07-17 00:00:10

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
	      /*delay = flight.dimension(function(d) { return Math.max(-60, Math.min(149, d.delay)); }),
	      delays = delay.group(function(d) { return Math.floor(d / 10) * 10; }),*/
	      startstation = rides.dimension(function(d){return d['start station id']; }),
	      startstationVals = startstation.group().reduceSum( function ( d ) {
				   return d3.format( '.2f' )( d['end station latitude'] );
				} ),
				startstations = startstation.group().reduceSum(function(d,i) { 
					//console.log(1); 
					return 1; }),
	      duration = rides.dimension(function(d) { return d.tripduration; }),
	      durations = duration.group(function(d) { return Math.floor(d / 10) * 10; }),
	      age = rides.dimension(function(d) { return d.age; }),
	      ages = age.group(function(d) { return Math.floor(d / 10) * 10; });
	     var charts = [

		    barChart()
		      .dimension(hour)
		      .group(hours)
		      .tickFormat(formatTimeofDay)
		      .barwidth(1.5)
		      .tickF([0,360,540,720,900,1080,1260,1440]
    			)
    			.y(d3.scale.linear().range([140, 0]))
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

		  var chartz = d3.selectAll(".chart")
	      .data(charts)
	      .each(function(chartz) { chartz.on("brush", renderAll).on("brushend", renderAll); });
		  
		  // Render the total.
		  d3.selectAll("#total")
		    .text(formatNumber(rides.size()));

		  renderAll();
		  // Renders the specified chart or list.
		  function render(method) {
		  	
		    d3.select(this).call(method);
		  }

		  var wx,
		  	testZ,
		  	testT;
		  function test(z, i) {

		  	var val = z.value / testT[i].value;

		  	wx.push(val);
		  }
		  function renderAll() {
		  	wx = [];
		  	
		    chartz.each(render);
		    //list.each(render);
		    d3.select("#active").text(formatNumber(all.value()));
		    testT = startstations.top(Infinity);
		    testZ = startstationVals.top(Infinity);
		    //console.log(startstations);
		    //var testTL = gender.top(Infinity).length;
		    testZ.forEach(function (v, i) {
        	test(v,i);
    		});
    		//console.log(wx);
		  }
			window.filter = function(filters) {
		    filters.forEach(function(d, i) { charts[i].filter(d); });
		    renderAll();
		  };
		  window.reset = function(i) {
		    charts[i].filter(null);
		    renderAll();
		  };

		  function barChart() {
		    if (!barChart.id) barChart.id = 0;
		    var margin = {top: 10, right: 20, bottom: 20, left: 15},
		      x,
		      y,
		      test,
		      id = barChart.id++,
		      axis = d3.svg.axis().orient("bottom"),
		      brush = d3.svg.brush(),
		      brushDirty,
		      dimension,
		      group,
		      round,
		      barW;

		    function chart(div) {
		      var width = x.range()[1],
		        height = y.range()[0];
		      y.domain([0, group.top(1)[0].value]);

		      div.each(function() {
		        var div = d3.select(this),
		            g = div.select("g");
		        // Create the skeletal chart.
		        if (g.empty()) {
		          div.select(".title").append("a")
		              .attr("href", "javascript:reset(" + id + ")")
		              .attr("class", "reset")
		              .text("reset")
		              .style("display", "none");
		          g = div.append("svg")
		              .attr("width", width + margin.left + margin.right)
		              .attr("height", height + margin.top + margin.bottom)
		            .append("g")
		              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		          g.append("clipPath")
		              .attr("id", "clip-" + id)
		            .append("rect")
		              .attr("width", width)
		              .attr("height", height);
		          g.selectAll(".bar")
		              .data(["background", "foreground"])
		            .enter().append("path")
		              .attr("class", function(d) { return d + " bar " + "z" + id; })
		              .datum(group.all());
		          g.selectAll(".foreground.bar")
		              .attr("clip-path", "url(#clip-" + id + ")");
		          g.append("g")
		              .attr("class", "axis")
		              .attr("transform", "translate(" + (margin.left - 15) + "," + height  + ")")
		              .call(axis);
		          // Initialize the brush component with pretty resize handles.
		          var gBrush = g.append("g").attr("class", "brush").call(brush);
		          gBrush.selectAll("rect").attr("height", height);
		          gBrush.selectAll(".resize").append("path").attr("d", resizePath);
		        }
		        // Only redraw the brush if set externally.
		        if (brushDirty) {
		          brushDirty = false;
		          g.selectAll(".brush").call(brush);
		          div.select(".title a").style("display", brush.empty() ? "none" : null);
		          if (brush.empty()) {
		            g.selectAll("#clip-" + id + " rect")
		                .attr("x", 0)
		                .attr("width", width);
		          } else {
		            var extent = brush.extent();
		            g.selectAll("#clip-" + id + " rect")
		                .attr("x", x(extent[0]))
		                .attr("width", x(extent[1]) - x(extent[0]));
		          }
		        }
		        g.selectAll(".bar").attr("d", barPath);
		      });
		      function barPath(groups) {
		        var path = [],
		            i = -1,
		            n = groups.length,
		            d;
		       	
		        while (++i < n) {
		          d = groups[i];
		          path.push("M", x(d.key), ",", height, "V", y(d.value), "h" + test + "V", height);
		        }
		        return path.join("");
		      }
		      function resizePath(d) {
		        var e = +(d == "e"),
		            x = e ? 1 : -1,
		            y = height / 3;
		        return "M" + (.5 * x) + "," + y
		            + "A6,6 0 0 " + e + " " + (6.5 * x) + "," + (y + 6)
		            + "V" + (2 * y - 6)
		            + "A6,6 0 0 " + e + " " + (.5 * x) + "," + (2 * y)
		            + "Z"
		            + "M" + (2.5 * x) + "," + (y + 8)
		            + "V" + (2 * y - 8)
		            + "M" + (4.5 * x) + "," + (y + 8)
		            + "V" + (2 * y - 8);
		      }
		    }
		    brush.on("brushstart.chart", function() {
		      var div = d3.select(this.parentNode.parentNode.parentNode);
		      div.select(".title a").style("display", null);
		    });
		    brush.on("brush.chart", function() {
		      var g = d3.select(this.parentNode),
		          extent = brush.extent();
		      if (round) g.select(".brush")
		          .call(brush.extent(extent = extent.map(round)))
		        .selectAll(".resize")
		          .style("display", null);
		      g.select("#clip-" + id + " rect")
		          .attr("x", x(extent[0]))
		          .attr("width", x(extent[1]) - x(extent[0]));
		      dimension.filterRange(extent);
		    });
		    brush.on("brushend.chart", function() {
		      if (brush.empty()) {
		        var div = d3.select(this.parentNode.parentNode.parentNode);
		        div.select(".title a").style("display", "none");
		        div.select("#clip-" + id + " rect").attr("x", null).attr("width", "100%");
		        dimension.filterAll();
		      }
		    });
		    chart.margin = function(_) {
		      if (!arguments.length) return margin;
		      margin = _;
		      return chart;
		    };
		    chart.x = function(_) {
		      if (!arguments.length) return x;
		      x = _;
		      axis.scale(x);
		      brush.x(x);
		      return chart;
		    };
		    chart.tickF = function(_) {
		    	if (!arguments.length) return tickF;
		    	tickF = _;
		    	axis.tickValues(tickF);
		    	//brush.tickF(tickF);
		    	return chart;
		    };
		    chart.y = function(_) {
		      if (!arguments.length) return y;
		      y = _;
		      axis.scale(y);
		      //brush.y(y);
		      return chart;
		    };
		    chart.dimension = function(_) {
		      if (!arguments.length) return dimension;
		      dimension = _;
		      return chart;
		    };
		    chart.tickFormat = function(_){
		    	if(!arguments.length) return tickFormat;
		    	tickFormat = _;
		    	axis.tickFormat(tickFormat);
		    	return chart;
		    }
		    chart.filter = function(_) {
		      if (_) {
		        brush.extent(_);
		        dimension.filterRange(_);
		      } else {
		        brush.clear();
		        dimension.filterAll();
		      }
		      brushDirty = true;
		      return chart;
		    };
		    chart.group = function(_) {
		      if (!arguments.length) return group;
		      group = _;
		      return chart;
		    };
		    chart.barwidth = function(_) {
		    	if (!arguments.length) return test;
		    	test = _;
		    	return chart;
		    }
		    chart.round = function(_) {
		      if (!arguments.length) return round;
		      round = _;
		      return chart;
		    };
		    return d3.rebind(chart, brush, "on");
		  }


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