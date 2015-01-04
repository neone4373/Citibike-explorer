//slider for one day, with station vectors changing by hour
// brushes + stacked area for age by five year intervals
//gender count line chart
//cumulative/density total rides chart
//type of rider

//http://zevross.com/blog/2014/09/30/use-the-amazing-d3-library-to-animate-a-path-on-a-leaflet-map/


/*var livingThings = crossfilter([
  // Fact data.
  { name: “Rusty”,  type: “human”, legs: 2 },
  { name: “Alex”,   type: “human”, legs: 2 },
  { name: “Lassie”, type: “dog”,   legs: 4 },
  { name: “Spot”,   type: “dog”,   legs: 4 },
  { name: “Polly”,  type: “bird”,  legs: 2 },
  { name: “Fiona”,  type: “plant”, legs: 0 }
]);*/


interactiveBuilder = {
	data:'',

	test:{success:true,language:'en'},
	show: function(){
		console.log(this.test.success)

	},
	slide: function(z){
		return z[0]

	},
	ready: function (error, data){
		interactiveBuilder.show();
		console.log(data);
		this.data = crossfilter(data);

		var typeDimension = this.data.dimension(function(d) { return d.gender; });
		typeDimension.filter(1)

		var n = this.data.groupAll().reduceCount().value();
		return console.log(n)
		//return console.log(this.data);
	},
	start: function (){

		queue()
    .defer(d3.csv,"./dataset/dataset.csv")
    .await(interactiveBuilder.ready);

	}
}

//tonight
//perform a crossfilter function on the data. use a brush.
