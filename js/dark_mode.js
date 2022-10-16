(function(exports) {
  'use strict';

  var darkModeEnabled = localStorage.getItem('ws.darkMode');
  var darkModeCheckbox = document.getElementById('dark-mode');
  var root = document.querySelector(':root');

  root.dataset.theme = darkModeEnabled ? 'dark' : 'light';
  darkModeCheckbox.checked = darkModeEnabled;

  darkModeCheckbox.addEventListener('change', function() {
    localStorage.setItem('ws.darkMode', darkModeCheckbox.checked);
    root.dataset.theme = darkModeCheckbox.checked ? 'dark' : 'light';
  });
})(window);