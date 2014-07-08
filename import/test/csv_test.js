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
  it('comma separated list with a comma separated list field', function() {
    assert.deepEqual(csv.parse('00070000,Amesbury,"PK,K,1,2,3,4,5,6,7,8,9,10,11,12"'),['00070000','Amesbury','PK,K,1,2,3,4,5,6,7,8,9,10,11,12'])
  })
  it('first field leading zeros', function() {
    var result = csv.parse('00070000,Amesbury,"PK,K,1,2,3,4,5,6,7,8,9,10,11,12"')[0]
    //console.log(result)
    //console.log('00070000')
    assert(result=='00070000')
  })
  it('comma separated list with two quoted fields', function() {
    assert.deepEqual(csv.parse('"District Code",District,"Grade List"'),['District Code','District','Grade List'])
  })
})

describe('reverse parse csv', function(){
  it('comma separated nothing', function() {
    assert.deepEqual(csv.reverse_parse(["","","",4]), '"","","","4"' )
  })
})

