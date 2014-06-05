$(document).ready(function() {

	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;
	 	
	    matches = [];

	    if(q.length >= 3) { // Only search from 3rd character entered, makes it faster
		 
		    substrRegex = new RegExp(q, 'i');

		    $.each(strs, function(i, str) {
		    	// CHANGE ORG_CODE FOR ORG_NAME WHEN READY!!
		      if (substrRegex.test(str.org_code)) {
		        matches.push({ value: str.org_code });
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
		});

		$('#inputSchool').removeAttr('disabled').css('background','white').attr('placeholder','Enter school name...')
		$('.tt-hint').removeAttr('disabled')

  	});

 
});

