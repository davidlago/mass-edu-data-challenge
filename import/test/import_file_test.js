var assert = require("assert")
var path = require("path")
var async = require("async")
var fileutil = require("../fileutil")

var files
describe('import', function(){
  before(function(done){
    var dir = path.normalize(__dirname+"/"+"../../data")
    fileutil.filelist({
      dir: dir
    , extname: '.csv'
    }, function(filelist) {
      files = filelist
      done()
    })
  })
  describe('file list', function(){
    it('should create a long list of files', function() {
      assert.equal(107, files.length)
    })
  })
  describe('headlines', function(){
    it('return 5 lines', function(done) {
      fileutil.headlines(files[0], function(lines) {
        assert.equal(5, lines.length)
        //console.log(lines)
        done()
      })
    })
  })
  describe('parse header', function(){
    it('finds fields', function(done) {
      fileutil.header_parse(files[1], function(header_info) {
        //console.log(header_info)
        assert.equal(12, header_info.fields.length)
        done()
      })
    })
  })
  //describe('headers', function(){
  //  it('parse all', function(done) {
  //    async.eachSeries(files, function(filename, callback) {
  //      //console.log(filename)
  //      fileutil.header_parse(filename, function(header_info) {
  //        //console.log(header_info)
  //        assert(2 <= header_info.fields.length)
  //        callback()
  //      })
  //    }, done)
  //  })
  //})

  describe('in describe', function() {
    it('in it', function(done) {
      console.log(files.length)
      done()
    })
  })
})

