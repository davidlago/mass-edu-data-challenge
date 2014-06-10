var assert = require("assert")
var csv = require("../csv")

describe('parse csv', function(){
  it('comma separated nothing', function() {
    assert.deepEqual(csv.parse(',,,4'), ["","","",4])
  })
  it('comma separated integers', function() {
    assert.deepEqual(csv.parse('1,2,3,4'), [1,2,3,4])
  })
  it('comma separated reals', function() {
    assert.deepEqual(csv.parse('.1,2.,3.3,0.04,5'), [0.1,2.0,3.3,0.04,5])
  })
  it('comma separated strings', function() {
    assert.deepEqual(csv.parse('alpha,beta,gamma,delta'), ['alpha','beta','gamma','delta'])
  })
  it('comma separated strings', function() {
    assert.deepEqual(csv.parse('"alpha,beta,gamma"'), ['alpha,beta,gamma'])
  })
  it('comma separated quoted strings', function() {
    assert.deepEqual(csv.parse('"alpha, alpha","beta oh beta",gamma,delta'), ['alpha, alpha','beta oh beta','gamma','delta'])
  })
})

describe('reverse parse csv', function(){
  it('comma separated nothing', function() {
    assert.deepEqual(csv.reverse_parse(["","","",4]), '"","","","4"' )
  })
})

