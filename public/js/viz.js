$(document).ready(function() {

	var substringMatcher = function(strs) {
	  return function findMatches(q, cb) {
	    var matches, substringRegex;
	 	
	    matches = [];

	    if(q.length >= 2) { // Only search from 2nd character entered, makes it faster
		 
		    substrRegex = new RegExp(q, 'i');

		    $.each(strs, function(i, str) {
		    	var comp_name = str.dist_name + " - " + str.org_name
		      if (substrRegex.test(comp_name)) {   	
		        matches.push({ value: comp_name, valueKey: str.org_code });
		      }
		    });
	 	}
	    cb(matches);
	  };
	};

  var api_url = "http://massedu.info/api/"

	// Disable input until typeahead loads
	$('#inputSchool').attr('disabled',true);

	var schools = [];
	$.getJSON( api_url + "viz.json", function(data) {
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

      // Emtpy results div
      $("#resultsDiv").text("")

      // Query the visualizations
      $.getJSON( api_url + "viz.json", function(viz) {

          // Empty results div
          $("#resultsDiv").text("")

          // Add drop-down with visualizations
          $("#resultsDiv").append('<select class="form-control" id="vizDropDown"'
            + ' style="margin-bottom: 10px;"><option disabled>Select visualization...</option></select>')
          for(vizid in viz)
                
              $("#vizDropDown").append('<option value='+viz[vizid].name+
                '>'+viz[vizid].description+'</option>')

            }

          // Listen for realm selection
          $("#vizDropDown").change(function(a) {
            
            var selViz = $(this).val()
            
            // Do stuff here...


          });

      }); // Query the visualizations
			
    });

  });

});