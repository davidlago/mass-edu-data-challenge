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
	 
      cont.append(JSON.stringify(school))

  	});

};
