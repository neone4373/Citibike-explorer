"use strict";
var layMap = (function(){
    function p(name) {
        return function(d){ return d[name]; };
    }

var theMap = {
        viewLong:40.724,
        viewLat:-73.988 };

L.mapbox.accessToken = 'pk.eyJ1IjoicGV0dWxsYSIsImEiOiJwS2NQbHM0In0.H4_dRGQiQAyFKoxcbc9x1g';

var map = L.mapbox.map('mapSpace').setView([theMap.viewLong, theMap.viewLat], 13);

  var topPane = map._createPane('leaflet-top-pane', map.getPanes().mapPane);
    var topLayer = L.mapbox.tileLayer('petulla.jdmil1i6').addTo(map);

    var svg = d3.select(map.getPanes().overlayPane).append("svg");

    var g = svg.append("g").attr("class", "leaflet-zoom-hide");

    function drawMap(coordVals){
        if (typeof coordVals === 'undefined'){
            var series = [[{lo: -73.99517, lat:40.7229 }, {lo: -73.99517, lat:40.7229}]];
        }
        else { 
            var seriesFirst = coordVals;
            var series = [];
            for (var i=0;i<seriesFirst.length;i++){
                if(seriesFirst[i]['value']['count'] !== 0) { 
                    series.push([{lo:+seriesFirst[i]['value']['startlongi'],lat:+seriesFirst[i]['value']['startlati']},{lo:+seriesFirst[i]['value']['longiaverage'],lat:+seriesFirst[i]['value']['latiaverage'] }])
                }
            }

            if(series.length === 0){
                series = [[{lo: -73.99517, lat:40.7229 }, {lo: -73.99517, lat:40.7229}]];
            }
        }

        var transform = d3.geo.transform({
            point: projectPoint
        });

        var d3path = d3.geo.path().projection(transform);

        var toLine = d3.svg.line()
          .interpolate("basis")
            .x(function(d,i) {
                return applyLatLngToLayer(d).x
            })
            .y(function(d,i) {
                return applyLatLngToLayer(d).y
            });

        g.selectAll(".lineConnect").remove();

        var linePath = g.selectAll('.lineConnect')
            .data(series)
            .enter()
            .append("path")
            .attr("class", "lineConnect").attr("stroke","#27dff6");
           
        map.on("viewreset", reset);

           var colorScale = d3.scale.linear();
        colorScale.range(['#27dff6', '#78006b'])
            .domain([0,250]);

        reset(); 
        linePath.each(transition);

        function reset() {

          function reformat(array) {
                var data = [];
                array.map(function (d, i) {
                    var j = d.length;
                  for (i=0;i<j;i++){
                    data.push({
                        id: i,
                        type: "Feature",
                        geometry: {
                            coordinates: [+d[i].lo, +d[i].lat],
                            type: "Point"
                        }
                    });
                  }
                });
                return data;
            }

            var geoData = { type: "FeatureCollection", features: reformat(series) };

          var bounds = d3path.bounds(geoData),
                topLeft = bounds[0],
                bottomRight = bounds[1];

           svg.attr("width", bottomRight[0] - topLeft[0] + 120 + 'px')
                .attr("height", bottomRight[1] - topLeft[1] + 120 + 'px')
                .style("left", topLeft[0] - 50 + "px")
                .style("top", topLeft[1] - 50 + "px");

            linePath.attr("d", toLine)

            g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");
        } 

        function transition() {
            d3.select(this).transition()
                .duration(700).attrTween("stroke-dasharray", tweenDash).attr("stroke",function(d){ return colorScale(this.getTotalLength()); });
        }
    
         function tweenDash() {
            var that = this;
            return function(t) {
                var l = that.getTotalLength(); 
                var interpolate = d3.interpolateString("0," + l, l + "," + l);
                return interpolate(t);
            }
         }
 
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        }
    }
    function applyLatLngToLayer(d) {
    
        var y = d.lat;
        var x = d.lo;
        return map.latLngToLayerPoint(new L.LatLng(y, x))
    }
    return {
        drawMap:drawMap
    }
})()