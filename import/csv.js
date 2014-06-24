exports.parse = function(line) {
  var chopped = []
  var chunk = ""
  var in_quote = false
  var c
  for (var i = 0; i < line.length; i++) {
    c = line.charAt(i)
    if (in_quote) {
      if (c != '"') {
        chunk += c
      } else {
        in_quote = false
      }
    } else {
      if (c == '"') {
        in_quote = true
      } else {
        if (c != ',') {
          chunk += c
        } else {
          if (chunk === chunk*1 && chunk.length) {
            chopped.push(chunk*1)
          } else {
            chopped.push(chunk)
          }
          chunk = ""
        }
      }
    }
  }
  if (chunk === chunk*1 && chunk.length) {
    chopped.push(chunk*1)
  } else {
    chopped.push(chunk)
  }
  return chopped
}
// Just put everything in quotes for now
exports.reverse_parse = function(array) {
  var line = ''
  return '"'+array.join('","')+'"'
}
