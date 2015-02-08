//thanks to github.com/1wheel for some of the ideas for this code.

function p(name){
  return function(d){ return d[name]; }
}
function toPositiveRadian(r){ return r > 0 ? r : r + Math.PI*2; };
function toDegree(r){ return r*180/Math.PI; };
zoomRender = false;
function circleChart() {
  if (!circleChart.id) circleChart.id = 0;

  var margin = {top: 0, right: 0, bottom: 0, left: 0},
      id = circleChart.id++,
      axis = d3.svg.axis().orient("bottom"),
      brush = d3.svg.cbrush().innerRadius(30).outerRadius(75),
      brushDirty,
      dimension,
      group,
      chartName,
      label = [],
      round,
      barWidth,
      size = 150,
      heightScale = d3.scale.linear().range([30, 75]),
      height,
      numGroups;

  var arcGen = d3.svg.arc()
    .innerRadius( function(d, i){ return heightScale.range()[0]; })
    .outerRadius( function(d, i){
      if(isNaN(heightScale(d.value))){ debugger}
      return heightScale(d.value); })
    .startAngle(  function(d, i){ return Math.PI*2/numGroups*(i - 1); })
    .endAngle(    function(d, i){ return Math.PI*2/numGroups*i; });

  function chart(div) {
    var width = size;
        height = size;

    numGroups = group.all().length;
    heightScale.domain(d3.extent(group.all().map(function(d){ return d.value; })));

    div.each(function() {
      var div = d3.select(this),
          g = div.select("g");

      // Create the skeletal chart.
      if (g.empty()) {
        div.select(".resettitle").append("a")
            .attr("href", "javascript:creset(" + id + ")")
            .attr("class", "reset")
            .html("<div class=\"reset\">Reset</div>");

        var g = div.append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + (margin.left + size/2) + "," 
                                            + (margin.top  + size/2) + ")");

        g.selectAll(".bar")
            .data(group.all()).enter()
          .append("path")
            .attr("class", "foreground bar " + chartName + "");

        var gBrush = g.append("g").attr("class", "brush").call(brush);
        gBrush.selectAll(".resize")
          .append("path").attr("d", resizePath);

        g.append('g')
            .classed('axis', true)
          .selectAll('text')
            .data(label).enter()
          .append('text')
            .text(function(d, i){ return d; })
            .attr('text-anchor', 'middle')
            .attr('x', function(d, i){ return !(i % 2) ? 0 :  i == 1 ?  16 : -16; })
            .attr('y', function(d, i){ return  (i % 2) ? 4 :  i == 0 ? -14 :  22; });
      }

     div.select("svg").selectAll(".bar")
      .transition().duration(zoomRender ? 20 : 20)
        .attr("d", arcGen)
            .attr("class", "foreground bar " + chartName + "");

      div.select(".reset").style("background-color", brush.empty() ? "#e2e2e2" : "#F48FB1");
      div.select(".resettitle a").attr("href", brush.empty() ? null : "javascript:creset(" + id + ")")

      if (brushDirty){
        brushDirty = false;
        g.selectAll('.brush').call(brush);

        //only works for reseting...
        if (brush.empty()){
          g.selectAll('.bar').style('fill', '#FFC400');
        }
      }
    });

    function resizePath(d) {
      var e = +(d == 0),
          x = e ? 1 : -1,
          y = height/6;
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

  brush.on("brush.chart", function() {
    var g = d3.select(this.parentNode),
        extent = brush.extent();
    var s = d3.scale.linear().domain([-Math.PI, 0, Math.PI]).range([0, Math.PI, Math.PI*2]);
    
    function isBetween(i){ 
      var θ = 360*(i/numGroups - .5/numGroups); 
      if (extentD[0] < extentD[1]){ return extentD[0] <= θ && θ <= extentD[1]; }
      return extentD[0] < θ || θ < extentD[1]; 
    }
    var extentD = extent.map(toPositiveRadian).map(toDegree);

    g.selectAll(".bar").style('fill', function(d, i){ return isBetween(i) ? '#FFC400' : '#ccc'; });
    dimension.filterFunction(isBetween)

  });

  chart.margin = function(_) {
    if (!arguments.length) return margin;
    margin = _;
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
  chart.chartName = function(_) {
    if (!arguments.length) return chartName;
    chartName = _;
    return chart;
  };

  chart.label = function(_){
    if (!arguments.length) return label;
    label = _;
    return chart;
  }

  return d3.rebind(chart, brush, "on");
}