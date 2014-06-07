$(document).ready(function() {

	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;
	 	
	    matches = [];

	    if(q.length >= 2) { // Only search from 2nd character entered, makes it faster
		 
		    substrRegex = new RegExp(q, 'i');

		    $.each(strs, function(i, str) {
		      if (substrRegex.test(str.org_name)) {
		      	var comp_name = str.dist_name + " - " + str.org_name
		        matches.push({ value: comp_name, valueKey: str.org_code });
		      }
		    });
	 	}
	    cb(matches);
	  };
	};

	// Disable input until typeahead loads
	$('#inputSchool').attr('disabled',true);

	var schools = [];
	$.getJSON( "http://massedu.info/api/schools", function(data) {
		schools = data;
		$('#schoolsTypeahead .typeahead').typeahead({
			  hint: true,
			  highlight: true,
			  minLength: 1
			},
			{
			  name: 'schools',
			  displayKey: 'value',
			  source: substringMatcher(schools)
	    	}
	    );

		$('#inputSchool').removeAttr('disabled').css('background','white').attr('placeholder','Enter school name...')
		$('.tt-hint').removeAttr('disabled')
		
		// Function that handles user selection
		$('#inputSchool').on('typeahead:selected', function (e, datum) {

      $("#resultsDiv").text("")
      $("#resultsDiv").append("<p>Searching records for " + datum.value + "...</p>")
			// Query the school
			var url = "http://massedu.info/api/schools/" + datum.valueKey
			$.getJSON( url, function(data) {

        $("#resultsDiv").text("")
        $("#resultsDiv").append("<p>We didn't say it would look pretty :)</p>")
        $("#resultsDiv").append( "<p>" + JSON.stringify(data) + "</p>")
			});
		    
		});

  });

});

