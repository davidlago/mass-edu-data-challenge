var assert = require("assert")
var util = require("../field_util")

describe('parse json', function(){
  it('state', function() {
    assert.deepEqual(util.identify_org_type(["00000000"]), [["state"]])
  })
  it('district', function() {
    assert.deepEqual(util.identify_org_type(["23450000"]), [["district"]])
  })
  it('school', function() {
    assert.deepEqual(util.identify_org_type(["12345678"]), [["school"]])
  })
  it('school,other,district', function() {
    assert.deepEqual(util.identify_org_type(["12345678","abba","12340000"]), [["school"],[],["district"]])
  })
  it('district_short', function() {
    assert.deepEqual(util.identify_org_type(["1997"]), [["district_short"]])
  })
  
})

