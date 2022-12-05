function EnglishToArabicNumerals(numberString) {
  var arabicNumerals = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
  if (document.dir == 'rtl') {
    return numberString.toString().replace(/[0-9]/g, function(w) {
      return arabicNumerals[+w];
    });
  } else {
    return numberString;
  }
}

if (location.hash == '' || location.hash == '#') {
  location.hash = '#month-view'
}