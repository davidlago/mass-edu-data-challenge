$(document).ready(function() {

	// var substringMatcher = function(strs) {
	//   return function findMatches(q, cb) {
	//     var matches, substringRegex;
	 	
	//     matches = [];

	//     if(q.length >= 2) { // Only search from 2nd character entered, makes it faster
		 
	// 	    substrRegex = new RegExp(q, 'i');

	// 	    $.each(strs, function(i, str) {
	// 	    	var comp_name = str.dist_name + " - " + str.org_name
	// 	      if (substrRegex.test(comp_name)) {   	
	// 	        matches.push({ value: comp_name, valueKey: str.org_code });
	// 	      }
	// 	    });
	//  	}
	//     cb(matches);
	//   };
	// };

 //  var api_url = "http://massedu.info/api/"

	// // Disable input until typeahead loads
	// $('#inputSchool').attr('disabled',true);

	// var schools = [];
	// $.getJSON( api_url + "schools.json", function(data) {
	// 	schools = data;
	// 	$('#schoolsTypeahead .typeahead').typeahead({
	// 		  hint: true,
	// 		  highlight: true,
	// 		  minLength: 1
	// 		},
	// 		{
	// 		  name: 'schools',
	// 		  displayKey: 'value',
	// 		  source: substringMatcher(schools)
	//     	}
	//     );

	// 	$('#inputSchool').removeAttr('disabled').css('background','white').attr('placeholder','Enter school name...')
	// 	$('.tt-hint').removeAttr('disabled')
		
	// 	// Function that handles user selection
	// 	$('#inputSchool').on('typeahead:selected', function (e, datum) {

 //      // Emtpy results div
 //      $("#resultsDiv").text("")

 //      // Query the realms
 //      $.getJSON( api_url + "realms.json", function(realms) {

 //          // Empty results div
 //          $("#resultsDiv").text("")

 //          // Add drop-down with realms
 //          $("#resultsDiv").append('<select class="form-control" id="realmsDropDown"'
 //            + ' style="margin-bottom: 10px;"><option disabled>Select information type...</option></select>')
 //          for(realmid in realms)
 //            for(subrealmid in realms[realmid].subrealms) {
 //              if (realms[realmid].subrealms[subrealmid].org_type === "school" ||
 //                  realms[realmid].subrealms[subrealmid].org_type === "both")
                
 //                $("#realmsDropDown").append('<option value='+realms[realmid].subrealms[subrealmid].name+
 //                  '>'+realms[realmid].description+' - '+realms[realmid].subrealms[subrealmid].description+'</option>')

 //            }

 //          // Listen for realm selection
 //          $("#realmsDropDown").change(function(a) {
            
 //            var selRealm = $(this).val()
            
 //            // Query the years
 //            $.getJSON( api_url + "years.json", function(years) {

 //              $("#yearsDropDown").remove() // Clear years dropdown and results
 //              $("#resultsTable").remove()
 //              $("#dictLink").remove()

 //              // Add drop-down with years
 //              $("#resultsDiv").append('<select class="form-control" id="yearsDropDown"'
 //                + ' style="margin-bottom: 10px;"><option disabled>Select year...</option></select>')
 //              for(yearid in years) {
 //                $("#yearsDropDown").append('<option value='+years[yearid]+'>'+years[yearid]+'</option>')
 //              }
           
 //              // Listen for year selection
 //              $("#yearsDropDown").change(function(a) {

 //                var selYear = $(this).val()

 //                // Query the school
 //                $.getJSON( api_url + "schools/" + datum.valueKey + "?realm=" + selRealm
 //                    + "&year=" + selYear, function(school) {

 //                    $("#resultsTable").remove() // Clear results
 //                    $("#dictLink").remove()

 //                    if (school[0] != null) { // Results found!

 //                      var resultEntry = school[0][selRealm][0]

 //                      $("#resultsDiv").append('<table class="table table-condensed table-hover" id="resultsTable">'
 //                        +'<thead><th>Field</th><th>Value</th></thead></table>'
 //                        +'<p id="dictLink">For field descriptions, see the <a href=https://github.com/davidlago/mass-edu-data-challenge/raw/master/data/DATA%20DICTIONARY_2014.xlsx'
 //                        +' target="_blank">Data Dictionary</a>.</p>')

 //                      for(resultid in resultEntry)
 //                        $("#resultsTable").append('<tr><td>'+resultid+'</td><td>'+resultEntry[resultid]+'</td></tr>')

 //                    } else { // No results found

 //                      $("#resultsDiv").append('<table class="table table-condensed table-hover" id="resultsTable">'
 //                        +'<thead><th><th>No results found.</th></thead></table>')

 //                    }

 //                }); // Query the school

 //              });

 //            });

 //          });

 //      }); // Query the realms
			
 //    });

 //  });

});