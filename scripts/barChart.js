
		  function barChart() {
		    if (!barChart.id) barChart.id = 0;
		    var margin = {top: 5, right: 20, bottom: 20, left: 18},
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
		              .attr("href", "javascript:breset(" + id + ")")
		              .attr("class", "reset")
		              .html("<div class=\"reset\">Reset</div>")
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
		              .attr("transform", "translate(" + (18 - 18) + "," + height  + ")")
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
