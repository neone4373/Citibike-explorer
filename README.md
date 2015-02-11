![Citibike](./ghlogo.png)

Citibike dataset explorer
===============

The Citibike explorer is part of a project to create general-purpose dashboards that can be used for many datasets and visualizations. It is setup to display rides on New York City's public bikeshare system on the day of July 17, 2014, the busiest day of use of the service to date. The dashboard shows the average ride paths for every station on the Citibike station.

The core libraries behind it are Crossfilter.js, D3.js, Mapbox and jQuery.

Load the visual on [Heroku](http://citibike-explorer.herokouapp.com).

### Sourcing and data analysis

New York City's public Citibike service releases monthly datasets on the ['system data' website](http://www.citibikenyc.com/system-data).

The raw data contains the following, which services as the basis for the visual:

* Trip Duration (seconds)
* Start Time and Date
* Stop Time and Date
* Start Station Name
* End Station Name
* Station ID
* Station Lat/Long
* Bike ID
* User Type (Customer = 24-hour pass or 7-day pass user; Subscriber = Annual Member)
* Gender (Zero=unknown; 1=male; 2=female)
* Year of Birth

IPython notebook templates to parse and format the data for the visual can be found [here](http://nbviewer.ipython.org/github/petulla/Citibike-explorer/blob/master/Notebooks/full%20parse.ipynb) and [here](http://nbviewer.ipython.org/github/petulla/Citibike-explorer/blob/master/Notebooks/preparation.ipynb)


### Use with other data sets

There are lots of interesting observations to be made on the Citibike dataset, but it's really just a beginning for what this type of dashboard can do. Because the filtering charts are modular, other datasets can be used with some tweaking. This dashboard could be reconfigured for any city transit data or for weather, political or economic trends, or environmental data. 

Crossfilter.js requires a crossfilter object, which serves as the basis for dimensions and groups. Dimensions are what allows the complex filtering and recalculation. Groups are what makes it possible to display discrete bar graphs from a large (3mb+ dataset) with 35,000 rows.

```js
var rides = crossfilter(data),
all = rides.groupAll(),
	     
hour = rides.dimension(function(d) { return d.minuteonbike; }),
hours = hour.group(),

gender = rides.dimension(function(d) { return d.gender; }),
genderCheck = rides.dimension(function(d) { return d.gender; }),
gendersAvg = gender.group().reduce(reduceAddGender, reduceRemoveGender, reduceInitialGender).all()

```

Circular and bar chart objects are created and passed into a `renderAll()` function, which puts the charts on the page. The `barChart.js` and `circleChart.js` files in the `scripts` folder render the charts. This basic architecture comes from Jason Davies work on Crossfilter.js.

```js
cCharts = [
	circleChart()
		.dimension(duration)
		.group(durations)
		.chartName('duration')
		.label(['0m','15m','30m','45m'])
```

```js
 barChart()
  .dimension(hour)
  .group(hours)
  .tickFormat(formatTimeofDay)
  .barwidth(2)
  .tickF([0,24,48,72,96,120,144,168,192,216,240,264,288]
	)
	.y(d3.scale.linear().range([80, 0]))
	.x(d3.scale.linear()
  .domain([0,288])
  .rangeRound([0, 288*3]))
```

### Some nifty map work

The most fun part of making this visual was figuring out how to create the ride vectors from each station based on the filtered dimensions. Each path needs to be recalculated on the fly and animated.

The hard work of the animation relies on the stroke: dash-array technique outlined in the following [Source article](https://source.opennews.org/en-US/articles/animating-maps-d3-and-topojson/).

![Stroke](./intro/dynmaps_dasharray_style.png)

Another useful technique is the conversion of the changes in longitude/latitude start and end averages to X and Y coordinates that can be projected onto a zoomable map. Native Leaflet conversion functions perform this work.

Another useful function is the building of a bounding box from an array of coordinates that can be passed into `d3path.bounds()`, which sets the area where the paths will be projected. This is done with the below code.

```js
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
```

### Feedback (is welcome!)

Find me on Twitter [@spetulla](http://www.twitter.com/spetulla)
