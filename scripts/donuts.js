var drawGPie = (function () {

				var width = 100,
				    height = 100;

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


		  


			var drawBPie = (function () {

				var width = 100,
				    height = 100;

				var svg = d3.select("#boroughPie").append("svg")
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