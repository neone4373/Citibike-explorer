//slider for one day, with station vectors changing by hour
// brushes + stacked area for age by five year intervals
//gender count line chart
//cumulative/density total rides chart
//type of rider

//http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/


var livingThings = crossfilter([
  // Fact data.
  { name: “Rusty”,  type: “human”, legs: 2 },
  { name: “Alex”,   type: “human”, legs: 2 },
  { name: “Lassie”, type: “dog”,   legs: 4 },
  { name: “Spot”,   type: “dog”,   legs: 4 },
  { name: “Polly”,  type: “bird”,  legs: 2 },
  { name: “Fiona”,  type: “plant”, legs: 0 }
]);



$document.ready(function(){
	init();
})