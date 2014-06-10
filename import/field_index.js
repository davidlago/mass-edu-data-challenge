var _ = require("underscore")

var org_code_fields = ['SCHOOL', 'DIST_CODE', 'ORG_CODE', 'SCHOOL_CODE', 'DIST_SCHOOL_CODE', 'DISTRICT_CODE', '"District Code"', 'District Code', 'org_code', 'Org_code', 'Org Code']
var org_name_fields = ['ORG_NAME', 'DISTRICT_NAME', 'DISTRICT', 'SCHOOL_NAME', 'WPI_ORG_NAME', 'SchoolName', '"District Name"', 'DistrictName', '"DISTRICT NAME"', 'DISTRICT NAME', 'DIST_NAME']

var year_fields =  ['FY_CODE', 'REC_YEAR', 'ORG_FY', 'GRADUATING_YEAR', 'YEAR', 'SY', 'FY', 'Year', 'adminyear']

var find_field_index = function(fields, header) {
  return _.indexOf(header,_.find(fields, function(f) { return _.indexOf(header, f) != -1 }))
}

exports.org_code = function(array) {
  return find_field_index(org_code_fields, array)
}

exports.org_name = function(array) {
  return find_field_index(org_name_fields, array)
}

exports.year = function(array) {
  return find_field_index(year_fields, array)
}

