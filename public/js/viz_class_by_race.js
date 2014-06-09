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
	 

      for(i in school) {
        cont.append('<p><strong>Year: ' + school[i].year + '</strong></p>');
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

            cont.append('<p>' + RACE_AFRAME_PCT + '% afro-american students</p>')
            cont.append('<p>' + RACE_ASIAN_PCT + '% asian students</p>')
            cont.append('<p>' + RACE_HISPANIC_PCT + '% hispanic students</p>')
            cont.append('<p>' + RACE_WHITE_PCT + '% white students</p>')
            cont.append('<p>' + RACE_NATAME_PCT + '% native american students</p>')
            cont.append('<p>' + RACE_NAT_HPI_PCT + '% hawaiian/pacific islander students</p>')
            cont.append('<p>' + RACE_MULTI_RACE_PCT + '% multi-race students</p>')
            

          }

        }

      }

  	});

};
