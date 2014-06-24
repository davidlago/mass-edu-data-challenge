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

  var dictionary = {};
  $.getJSON( api_url + "dictionary.json", function(dict) {
    dictionary = dict;
    console.log('done!')
  });

	// Disable input until typeahead loads
	$('#inputSchool').attr('disabled',true);
  $('#inputSchool2').attr('disabled',true);

	var schools = [];
	$.getJSON( api_url + "schools.json", function(data) {
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

    $('#schoolsTypeahead2 .typeahead').typeahead({
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

		$('#inputSchool').removeAttr('disabled').css('background','white').attr('placeholder',"Enter first school's name...")
    $('#inputSchool2').removeAttr('disabled').css('background','white').attr('placeholder',"Enter second school's name...")
		$('.tt-hint').removeAttr('disabled')
    var schoolSelected1 = schoolSelected2 = ''
		
		// Function that handles user selection
    var respondToSelection = function (e, datum) {

      if ($(this).context.title === 'school1')
        schoolSelected1 = datum.valueKey
      else
        schoolSelected2 = datum.valueKey

      if(schoolSelected1 != '' && schoolSelected2 != '') {

        // Emtpy results div
        $("#resultsDiv").text("")

        // Query the realms
        $.getJSON( api_url + "realms.json", function(realms) {

            // Empty results div
            $("#resultsDiv").text("")

            // Add drop-down with realms
            $("#resultsDiv").append('<select class="form-control" id="realmsDropDown"'
              + ' style="margin-bottom: 10px;"><option disabled>Select information type...</option></select>')
            for(realmid in realms)
              for(subrealmid in realms[realmid].subrealms) {
                if (realms[realmid].subrealms[subrealmid].org_type === "school" ||
                    realms[realmid].subrealms[subrealmid].org_type === "both")
                  
                  $("#realmsDropDown").append('<option value='+realms[realmid].subrealms[subrealmid].name+
                    '>'+realms[realmid].description+' - '+realms[realmid].subrealms[subrealmid].description+'</option>')

              }

            // Listen for realm selection
            $("#realmsDropDown").change(function(a) {
              
              var selRealm = $(this).val()
              
              // Query the years
              $.getJSON( api_url + "years.json", function(years) {

                $("#yearsDropDown").remove() // Clear years dropdown and results
                $("[id^='resultsTable']").remove()
                $("#dictLink").remove()

                // Add drop-down with years
                $("#resultsDiv").append('<select class="form-control" id="yearsDropDown"'
                  + ' style="margin-bottom: 10px;"><option disabled>Select year...</option></select>')
                for(yearid in years) {
                  $("#yearsDropDown").append('<option value='+years[yearid]+'>'+years[yearid]+'</option>')
                }
             
                // Listen for year selection
                $("#yearsDropDown").change(function(a) {

                  var selYear = $(this).val()

                  // Query the school1
                  $.getJSON( api_url + "schools/" + schoolSelected1 + "?realm=" + selRealm
                      + "&year=" + selYear, function(school1) {

                    $.getJSON( api_url + "schools/" + schoolSelected2 + "?realm=" + selRealm
                        + "&year=" + selYear, function(school2) {

                        $("[id^='resultsTable']").remove() // Clear results
                        $("#dictLink").remove()

                        if (school1[0] != null && school2[0] != null) { // Results found!

                          var resultEntries1 = school1[0][selRealm]
                          var resultEntries2 = school2[0][selRealm]

                          for (idEntry in resultEntries1) {
                            var resultEntry1 = resultEntries1[idEntry]
                            var resultEntry2 = resultEntries2[idEntry]


                            $("#resultsDiv").append('<div class="table-responsive"><table class="table table-condensed table-hover" id="resultsTable'+idEntry+'">'
                              +'<thead><th>Field</th><th>School 1</th><th>School 2</th></thead></table></div>')

                            for(resultid in resultEntry1) {
                              $("#resultsTable"+idEntry).append('<tr><td><div id="'+resultid+'" data-toggle="tooltip" data-placement="top" title="'+dictionary[resultid]+'">'+resultid+'</div></td><td>'+resultEntry1[resultid]
                                +'</td><td>'+resultEntry2[resultid]+'</td></tr>');
                              $('#'+resultid).tooltip();
                            }
           
                          }

                          $("#resultsDiv").append('<p id="dictLink"><em>For field descriptions, hover over the field names.</em></p>')

                        } else { // No results found

                          $("#resultsDiv").append('<div class="table-responsive"><table class="table table-condensed table-hover" id="resultsTable">'
                            +'<thead><th>One or both of the schools are missing data for the selected realm/year.</th></thead></table></div>')

                        }



                    }); // Query the school2
                  }); // Query the school1
                });

              });

            });

        }); // Query the realms
			}
    }

    $('#inputSchool').on('typeahead:selected', respondToSelection)
    $('#inputSchool2').on('typeahead:selected', respondToSelection)

  });

  

});