//understand method
//review all code
//see how the filter works. like, how does that work?

//slider for one day, with station vectors changing by hour
// brushes + stacked area for age by five year intervals
//gender count line chart
//cumulative/density total rides chart
//type of rider

//http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/

//create graph for, say, date
//add brush

(function z(){
	interactiveBuilder = {
			data:'',
		dataCF:'',
		dataHours:'',

		test:{success:true,language:'en'},
		filterData: function(){

			var typeDimension = this.data.dimension(function(d) { return d.gender; });
			typeDimension.filter(1)

		},
		buildBrush: function(z){


		},
		brushMove: function(){
			interactiveBuilder.buildBrush("#rightInfo")

		},
		init: function(){
			//build brush
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
			  d['stop station id'] = +d['stop station id'];
			  d['start station latitude'] = +['start station latitude'];
			  d['end station latitude'] = +['end station latitude'];
			  d['start station longitude'] = +['start station longitude'];
			  d['end station longitude'] = +['end station longitude'];
			  d.gender = +d.gender;
			  d.age = +d.age;
			});

			function parseDate() {
				//tk;
			}

			var rides = crossfilter(data),
	      all = rides.groupAll(),
	      /*startTime = rides.dimension(function(d) { return d.starttime; }),
	      startTimes = startTime.group(d3.time.day),*/
	      hour = rides.dimension(function(d) { 
	      	return (d.starttime.getHours() * 60) + (d.starttime.getMinutes()); 
	      }),
	      hours = hour.group(Math.floor);
	      gender = rides.dimension(function(d) { return d.gender; }),
	      genders = gender.group(Math.floor);
	      /*delay = flight.dimension(function(d) { return Math.max(-60, Math.min(149, d.delay)); }),
	      delays = delay.group(function(d) { return Math.floor(d / 10) * 10; }),*/
	      duration = rides.dimension(function(d) { return d.tripduration; }),
	      durations = duration.group(Math.floor);
	     var charts = [

		    barChart()
		      .dimension(hour)
		      .group(hours)
		    	.x(d3.scale.linear()
		    	//.domain(d3.extent(hours.all()[0]))
		      .domain([0,1440])
		      .rangeRound([0, 1000])),

		    barChart()
		      .dimension(duration)
		      .group(durations)
		    	.x(d3.scale.linear()
		    	//.domain(d3.extent(hours.all()[0]))
		      .domain([0,2500])
		      .rangeRound([0, 800])),

		      barChart()
		      .dimension(gender)
		      .group(genders)
		    	.x(d3.scale.linear()
		    	//.domain(d3.extent(hours.all()[0]))
		      .domain([0,2.1])
		      .rangeRound([0, 200])),
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
		  // Whenever the brush moves, re-rendering everything.
		  function renderAll() {
		  	
		    chartz.each(render);
		    //list.each(render);
		    d3.select("#active").text(formatNumber(all.value()));
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
		    var margin = {top: 10, right: 10, bottom: 20, left: 10},
		      x,
		      y = d3.scale.linear().range([150, 0]),
		      id = barChart.id++,
		      axis = d3.svg.axis().orient("bottom"),
		      brush = d3.svg.brush(),
		      brushDirty,
		      dimension,
		      group,
		      round;

		    function chart(div) {
		      var width = x.range()[1],
		        height = y.range()[0];
		      y.domain([0, group.top(1)[0].value]);

		      axis
    			.tickFormat(formatCurrency).tickValues([0,360,720,1080,1440])
					 function formatCurrency(d) {
					  
					  return d/60
					    
					}
		      //console.log(group);

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
		              .attr("class", function(d) { return d + " bar"; })
		              .datum(group.all());
		          g.selectAll(".foreground.bar")
		              .attr("clip-path", "url(#clip-" + id + ")");
		          g.append("g")
		              .attr("class", "axis")
		              .attr("transform", "translate(0," + height + ")")
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
		          path.push("M", x(d.key), ",", height, "V", y(d.value), "h.6V", height);
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
		    chart.y = function(_) {
		      if (!arguments.length) return y;
		      y = _;
		      return chart;
		    };
		    chart.dimension = function(_) {
		      if (!arguments.length) return dimension;
		      dimension = _;
		      return chart;
		    };
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
		    chart.round = function(_) {
		      if (!arguments.length) return round;
		      round = _;
		      return chart;
		    };
		    return d3.rebind(chart, brush, "on");
		  }

			interactiveBuilder.data = data;
			interactiveBuilder.dataCF = rides;

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

