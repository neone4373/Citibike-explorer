
var layMap = (function(){
    function p(name){
        return function(d){ return d[name]; }
    }

    

var theMap = {
        viewLong:40.738,
        viewLat:-73.985
  };

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
            //console.log(seriesFirst.length);
            var series = []
            for (i=0;i<seriesFirst.length;i++){
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
          .interpolate("linear")
            .x(function(d,i) {
                return applyLatLngToLayer(d).x
            })
            .y(function(d,i) {
                return applyLatLngToLayer(d).y
            });

        g.selectAll(".lineConnect").remove();

        var linePath = g.selectAll(".lineConnect")
            .data(series)
            .enter()
            .append("path")
            .attr("class", "lineConnect")
            //.attr("d", toLine);

        /*var originANDdestination = [featuresdata[0]]

        var begend = g.selectAll(".drinks")
            .data(originANDdestination)
            .enter()
            .append("circle", ".drinks")
            .attr("r", 5)
            .style("fill", "red")
            .style("opacity", "1");*/

        map.on("viewreset", reset);

        reset(); linePath.each(transition);

        // Reposition the SVG to cover the features.
        function reset() {

          function reformat(array) {
                var data = [];
                array.map(function (d, i) {
                  for (i=0;i<d.length;i++){
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


                //console.log(bounds);

                //console.log(bounds);

            // for the points we need to convert from latlong
            // to map units
            /*begend.attr("transform",
                function(d) {
                    return "translate(" +
                        applyLatLngToLayer(d).x + "," +
                        applyLatLngToLayer(d).y + ")";
                });*/


            // Setting the size and location of the overall SVG container
           svg.attr("width", bottomRight[0] - topLeft[0] + 120 + 'px')
                .attr("height", bottomRight[1] - topLeft[1] + 120 + 'px')
                .style("left", topLeft[0] - 50 + "px")
                .style("top", topLeft[1] - 50 + "px");


            // linePath.attr("d", d3path);
            linePath.attr("d", toLine)
            // ptPath.attr("d", d3path);

            g.attr("transform", "translate(" + (-topLeft[0] + 50) + "," + (-topLeft[1] + 50) + ")");

        } // end reset

        // the transition function could have been done above using
        // chaining but it's cleaner to have a separate function.
        // the transition. Dash array expects "500, 30" where 
        // 500 is the length of the "dash" 30 is the length of the
        // gap. So if you had a line that is 500 long and you used
        // "500, 0" you would have a solid line. If you had "500,500"
        // you would have a 500px line followed by a 500px gap. This
        // can be manipulated by starting with a complete gap "0,500"
        // then a small line "1,500" then bigger line "2,500" and so 
        // on. The values themselves ("0,500", "1,500" etc) are being
        // fed to the attrTween operator
        function transition() {
            d3.select(this).transition()
                .duration(700).attrTween("stroke-dasharray", tweenDash);
        }
    
         function tweenDash() {
            var that = this;
            return function(t) {
                var l = that.getTotalLength(); 
                interpolate = d3.interpolateString("0," + l, l + "," + l);
                return interpolate(t);
            }
         }
 
        //end tweenDash

        // Use Leaflet to implement a D3 geometric transformation.
        // the latLngToLayerPoint is a Leaflet conversion method:
        //Returns the map layer point that corresponds to the given geographical
        // coordinates (useful for placing overlays on the map).
        function projectPoint(x, y) {
            var point = map.latLngToLayerPoint(new L.LatLng(y, x));
            this.stream.point(point.x, point.y);
        } //end projectPoint
    }



    // similar to projectPoint this function converts lat/long to
    // svg coordinates except that it accepts a point from our 
    // GeoJSON

    function applyLatLngToLayer(d) {
        var y = d.lat;
        var x = d.lo;
        return map.latLngToLayerPoint(new L.LatLng(y, x))
    }
    return {
        drawMap:drawMap
    }
})()