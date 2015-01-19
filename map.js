
var layMap = (function(){
    function p(name){
        return function(d){ return d[name]; }
    }

    
    var mapboxTiles = L.tileLayer('https://{s}.tiles.mapbox.com/v3/examples.map-zr0njcqy/{z}/{x}/{y}.png', {
        attribution: '<a href="http://www.mapbox.com/about/maps/" target="_blank">Terms &amp; Feedback</a>'
    });


    var map = L.map('mapSpace')
        .addLayer(mapboxTiles)
        .setView([40.72332345541449, -73.99], 13);


    // we will be appending the SVG to the Leaflet map pane
    // g (group) element will be inside the svg 
    var svg = d3.select(map.getPanes().overlayPane).append("svg");

    // if you don't include the leaflet-zoom-hide when a 
    // user zooms in or out you will still see the phantom
    // original SVG 
    var g = svg.append("g").attr("class", "leaflet-zoom-hide");

    function drawMap(coordVals){
    //read in the GeoJSON. This function is asynchronous so
    // anything that needs the json file should be within

        // this is not needed right now, but for future we may need
        // to implement some filtering. This uses the d3 filter function
        // featuresdata is an array of point objects

      if (typeof coordVals === 'undefined'){
        var series = [
        [{time: 1, lo: -73.9927, lat:40.72219 }, {time: 2, lo: -73.98105, lat:40.73432}],
        [{time: 1, lo: -73.99517, lat:40.7229 }, {time: 2, lo: -73.9845, lat:40.72139}]
          ];
        }
        else { 
            var seriesFirst = coordVals;
            //console.log(seriesFirst.length);
            var series = []
            for (i=0;i<300;i++){
                if(seriesFirst[i]['value']['count'] !== 0) { 
                    series.push([{lo:+seriesFirst[i]['value']['startlongi'],lat:+seriesFirst[i]['value']['startlati']},{lo:+seriesFirst[i]['value']['longiaverage'],lat:+seriesFirst[i]['value']['latiaverage'] }])
                }
            }
           
            if(series.length === 0){
                series = [[{lo: -73.99517, lat:40.7229 }, {lo: -73.99517, lat:40.7229}]];
            }
        }
        //console.log('done');


        var transform = d3.geo.transform({
            point: projectPoint
        });

        //d3.geo.path translates GeoJSON to SVG path codes.
        //essentially a path generator. In this case it's
        // a path generator referencing our custom "projection"
        // which is the Leaflet method latLngToLayerPoint inside
        // our function called projectPoint
        var d3path = d3.geo.path().projection(transform);


        var toLine = d3.svg.line()
          .interpolate("linear")
            .x(function(d,i) {
                return applyLatLngToLayer(d).x
            })
            .y(function(d,i) {
                return applyLatLngToLayer(d).y
            });


        // From now on we are essentially appending our features to the
        // group element. We're adding a class with the line name
        // and we're making them invisible
        
        //console.log(collection.features);
        
        // Here we will make the points into a single
        // line/path. Note that we surround the featuresdata
        // with [] to tell d3 to treat all the points as a
        // single line. For now these are basically points
        // but below we set the "d" attribute using the 

        g.selectAll(".lineConnect").remove();
        // line creator function from above.
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

        reset();
        transition();

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
            linePath.transition()
                .duration(800)
                .attrTween("stroke-dasharray", tweenDash);
        } //end transition //end transition

        // this function feeds the attrTween operator above with the 
        // stroke and dash lengths
        function tweenDash() {
            return function(t) {
                //total length of path (single value)
                var l = linePath.node().getTotalLength(); 
                // this is creating a function called interpolate which takes
                // as input a single value 0-1. The function will interpolate
                // between the numbers embedded in a string. An example might
                // be interpolatString("0,500", "500,500") in which case
                // the first number would interpolate through 0-500 and the
                // second number through 500-500 (always 500). So, then
                // if you used interpolate(0.5) you would get "250, 500"
                // when input into the attrTween above this means give me
                // a line of length 250 followed by a gap of 500. Since the
                // total line length, though is only 500 to begin with this
                // essentially says give me a line of 250px followed by a gap
                // of 250px.
                interpolate = d3.interpolateString("0," + l, l + "," + l);
                //t is fraction of time 0-1 since transition began
               // var marker = d3.select("#marker");
                
                // p is the point on the line (coordinates) at a given length
                // along the line. In this case if l=50 and we're midway through
                // the time then this would 25.
                //var p = linePath.node().getPointAtLength(t * l);

                //Move the marker to that point
                //marker.attr("transform", "translate(" + p.x + "," + p.y + ")"); //move marker
                return interpolate(t);
            }
        } //end tweenDash

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