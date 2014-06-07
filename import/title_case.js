exports.toTitleCase = function(original) {
  //var str = original.replace(/\w\S*/g, function(txt){
  var str = original.replace(/([^\W_]+[^\s-/]*) */g, function(txt){
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  })

  // Certain minor words should be left lowercase unless 
  // they are the first or last words in the string
  // Remove 'A' since it could be an initial
  var lowers = ['An', 'The', 'And', 'But', 'Or', 'For', 'Nor', 'As', 'At', 
  'By', 'For', 'From', 'In', 'Into', 'Near', 'Of', 'On', 'Onto', 'To', 'With'];
  for (i = 0, j = lowers.length; i < j; i++) {
    str = str.replace(new RegExp('\\s' + lowers[i] + '\\s', 'g'), function(txt) {
      return txt.toLowerCase()
    })
  }

  // Certain words such as initialisms or acronyms should be left uppercase
  uppers = ['Id', 'Tv', 'Hs', 'Pk', 'Sda', 'Ii', 'Iii', 'Iv', 'Vi', 'Xxiii'];
  for (i = 0, j = uppers.length; i < j; i++) {
    str = str.replace(new RegExp('\\b' + uppers[i] + '\\b', 'g'), uppers[i].toUpperCase())
  }
  // Fix O'brian, etc
  str = str.replace(/O'[a-z]/, function(m) { return m.toUpperCase() })
  // Fix Mcgovern
  str = str.replace(/Mc[a-z]/, function(m) { return "Mc"+m[2].toUpperCase() })
  // Strip any *
  str = str.replace(/\*/,"")
  
  return str;
}


