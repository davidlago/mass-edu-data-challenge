/**
 * Visualization viz1 page.
 */

var viz_class_by_race = function(container, school, viz, api_url) {
  	
  	console.log("Creating " + viz + " for school " + school + " inside of "
  		+ container + ' from ' + api_url)

  	// Obtain the container in 'cont'
  	var cont = $("#"+container)

  	// Query the school
  	$.getJSON( api_url + "schools/" + school + "?realm=class_size_by_race", function(school) {
	 
      var AFRAME = []
      var ASIAN = []
      var HISPANIC = []
      var WHITE = []
      var NATAME = []
      var NAT_HPI = []
      var MULTI = []
      var YEARS = []

      for(i in school) {
        YEARS.push(school[i].year)
        for(j in school[i].class_size_by_race) {
          var COURSE_SUBJECT_NAME = school[i].class_size_by_race[j].COURSE_SUBJECT_NAME
          if (COURSE_SUBJECT_NAME === "All"){

            var RACE_AFRAME_PCT = school[i].class_size_by_race[j].RACE_AFRAME_PCT
            var RACE_ASIAN_PCT = school[i].class_size_by_race[j].RACE_ASIAN_PCT
            var RACE_HISPANIC_PCT = school[i].class_size_by_race[j].RACE_HISPANIC_PCT
            var RACE_WHITE_PCT = school[i].class_size_by_race[j].RACE_WHITE_PCT
            var RACE_NATAME_PCT = school[i].class_size_by_race[j].RACE_NATAME_PCT
            var RACE_NAT_HPI_PCT = school[i].class_size_by_race[j].RACE_NAT_HPI_PCT
            var RACE_MULTI_RACE_PCT = school[i].class_size_by_race[j].RACE_MULTI_RACE_PCT

            AFRAME.push(parseFloat(RACE_AFRAME_PCT))
            ASIAN.push(parseFloat(RACE_ASIAN_PCT))
            HISPANIC.push(parseFloat(RACE_HISPANIC_PCT))
            WHITE.push(parseFloat(RACE_WHITE_PCT))
            NATAME.push(parseFloat(RACE_NATAME_PCT))
            NAT_HPI.push(parseFloat(RACE_NAT_HPI_PCT))
            MULTI.push(parseFloat(RACE_MULTI_RACE_PCT))
          }

        }

      }
    
      // define dimensions of graph
      var m = [80, 80, 80, 80]; // margins
      var w = 1000 - m[1] - m[3]; // width
      var h = 400 - m[0] - m[2]; // height
      
      // Log in the console the arrays we are about to plot
      var data = AFRAME
      console.log(YEARS)
      console.log(AFRAME)
      console.log(ASIAN)
      console.log(HISPANIC)
      console.log(WHITE)
      console.log(NATAME)
      console.log(NAT_HPI)
      console.log(MULTI)

      // X scale will fit all values from data[] within pixels 0-w
      var x = d3.scale.linear().domain([0, data.length]).range([0, w]);
      // Y scale will fit values from 0-10 within pixels h-0 (Note the inverted domain for the y-scale: bigger is up!)
      var y = d3.scale.linear().domain([0, 10]).range([h, 0]);
        // automatically determining max range can work something like this
        // var y = d3.scale.linear().domain([0, d3.max(data)]).range([h, 0]);

      // create a line function that can convert data[] into x and y points
      var line = d3.svg.line()
        // assign the X function to plot our line as we wish
        .x(function(d,i) { 
          return x(i); 
        })
        .y(function(d) { 
          return y(d); 
        })

        // Add an SVG element with the desired dimensions and margin.
        var graph = d3.select("#"+container).append("svg:svg")
              .attr("width", w + m[1] + m[3])
              .attr("height", h + m[0] + m[2])
            .append("svg:g")
              .attr("transform", "translate(" + m[3] + "," + m[0] + ")");

        // create yAxis
        var xAxis = d3.svg.axis().scale(x).tickSize(-h).tickSubdivide(true);
        // Add the x-axis.
        graph.append("svg:g")
              .attr("class", "x axis")
              .attr("transform", "translate(0," + h + ")")
              .call(xAxis);


        // create left yAxis
        var yAxisLeft = d3.svg.axis().scale(y).ticks(4).orient("left");
        // Add the y-axis to the left
        graph.append("svg:g")
              .attr("class", "y axis")
              .attr("transform", "translate(-25,0)")
              .call(yAxisLeft);
        
        // Add the line by appending an svg:path element with the data line we created above
        // do this AFTER the axes above so that the line is above the tick-lines
        graph.append("svg:path").attr("d", line(data));


  	});

};
