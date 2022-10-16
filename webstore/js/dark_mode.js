(function(exports) {
  'use strict';

  var darkModeEnabled = localStorage.getItem('ws.darkMode');
  var root = document.querySelector(':root');

  root.dataset.theme = darkModeEnabled ? 'dark' : 'light';
})(window);