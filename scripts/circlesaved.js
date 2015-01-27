
		  /*
		  var circleGender = (function() {
		  	//thank you Bostock http://bl.ocks.org/mbostock/1346410
				var radius = Math.min(120, 120) / 2;

				var color = d3.scale.category20();

				var pie = d3.layout.pie().value(function(d){ return d; }).sort(null);
				var arc = d3.svg.arc()
				    .innerRadius(radius - 30)
				    .outerRadius(radius - 20);
				var dataPie = [gendersAvg[0]['value']['count'],gendersAvg[1]['value']['count']];
		  	var gX = drawGPie.svgV().append('g');
		  	var gX = drawGPie.svgV().append('g');
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
			  	var men = gendersAvg[0]['value']['count'];
			  	var women = gendersAvg[1]['value']['count'];
					var dataPie = [men,women];
					if (women === 0){
						dataPie = [1,0];
					}
					else if(men === 0){
						dataPie = [0,1];
					}
  				gX.datum(dataPie).selectAll("path").data(pie).transition().duration(50).attrTween("d", arcTween)
					
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

			var circleBorough = (function() {
		  	//thank you Bostock http://bl.ocks.org/mbostock/1346410
				var radius = Math.min(120, 120) / 2;

				var color = d3.scale.category20();

				var pie = d3.layout.pie().value(function(d){ return d; }).sort(null);
				var arc = d3.svg.arc()
				    .innerRadius(radius - 30)
				    .outerRadius(radius - 20);
				var dataPie = [boroughsAvg[0]['value']['count'],boroughsAvg[1]['value']['count']];
		  	var gX = drawBPie.svgV().append('g');
		  	var gX = drawBPie.svgV().append('g');
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
			  	var women = boroughsAvg[0]['value']['count'];
			  	var men = boroughsAvg[1]['value']['count'];
					var dataPie = [men,women];
					if (women === 0){
						dataPie = [1,0];
					} 
					else if (men === 0){
						dataPie = [0,1];
					}
  				gX.datum(dataPie).selectAll("path").data(pie).transition().duration(50).attrTween("d", arcTween)
					
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
			})() */
				// Store the displayed angles in _current.
				// Then, interpolate from _current to the new angles.
				// During the transition, _current is updated in-place by d3.interpolate.
				