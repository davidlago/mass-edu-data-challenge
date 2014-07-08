var _ = require('lodash')

exports.org_types = {
  year: /^((19[789][0-9])|(20[01][0-9]))$/
, district: /^(?!00000000$)[0-9]{4}0000$/
, district_short: /^(?!0000$)(?!((19[789][0-9])|(20[01][0-9]))$)[0-9]{4}$/
, state: /^00000000$/
, state_short: /^0000$/
, school: /^(?![0-9]{4}0000)[0-9]{8}$/
}

exports.identify_org_type = function(json) {
  var r = _.map(json, function(value) {
    var match = _.reduce(exports.org_types, function(result, regex, type) {
      if (value.match(regex)) {
        result.push(type)
      }
      return result
    }, [])
    return match
  })
  return r
}

exports.normalize_district = function(code) {
  if (code.match(exports.org_types.district)) {
    return code.substring(0,4)
  } else if (code.match(exports.org_types.district_short)) {
    return code
  } else {
    console.log(code)
    process.exit(1)
  }
}

exports.find_columns = function(json) {
  var result = {
    year: exports.find_column(json, exports.org_types.year)
  , school: exports.find_column(json, exports.org_types.school)
  , district: exports.find_column(json, exports.org_types.district)
  , district_short: exports.find_column(json, exports.org_types.district_short)
  , state: exports.find_column(json, exports.org_types.state)
  }
  if (result.school == -1 && result.district == -1 && result.district_short == -1) {
    console.log(json[20])
  }
  return result
}

exports.find_year_column = function(json) {
  return exports.find_column(json, exports.org_types.year)
}

exports.find_school_column = function(json) {
  return exports.find_column(json, exports.org_types.school)
}

exports.find_district_column = function(json) {
  return exports.find_column(json, exports.org_types.district)
}

exports.find_district_short_column = function(json) {
  return exports.find_column(json, exports.org_types.district_short)
}

exports.find_column = function(json, regex) {
  var chunk = _.last(_.first(json, 1000), 900)
  var counts = _.map(chunk[1], function(value, key) { return 0 })
  counts = _.reduce(chunk, function(results, row) {
    for (var i = 0; i < row.length; i++) {
      if (row[i].match(regex)) { results[i] = results[i] + 1 }
    }
    return results
  }, counts)
  var max = _.max(counts)
  var indices = [];
  var idx = counts.indexOf(max);
  while (idx != -1) {
    indices.push(idx);
    idx = counts.indexOf(max, idx + 1);
  }
  //if (indices.length < counts.length) {
  //  console.log(max, indices)
  //}
  //if (max > 25  && max < 30 ){
  //  _.each(chunk, function(row) {
  //    console.log(regex, row[indices[0]])
  //  })
  //  console.log(max)
  //}
  if (max < (chunk.length/5)) {
    return -1
  } else {
    return indices[0]
  }
}

