(function(exports) {
  'use strict';

  var selectedLanguage = localStorage.getItem('ws.language');
  var languageSelector = document.getElementById('languages');

  window.addEventListener('load', function() {
    navigator.mozL10n.language.code = selectedLanguage;
    if (selectedLanguage) {
      languageSelector.value = selectedLanguage;
    } else {
      languageSelector.value = 'en-US';
    }
  });

  var client = new XMLHttpRequest();
  client.open('GET', '/locales.json');
  client.onreadystatechange = function() {
    languageSelector.innerHTML = '';
    var entries = Object.entries(JSON.parse(client.responseText));
    entries.forEach(entry => {
      var option = document.createElement('option');
      option.value = entry[0];
      option.textContent = entry[1];
      languageSelector.appendChild(option);
    });
  };
  client.send();

  languageSelector.addEventListener('change', function() {
    localStorage.setItem('ws.language', languageSelector.value);
    navigator.mozL10n.language.code = languageSelector.value;
  });
})(window);