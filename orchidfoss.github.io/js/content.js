(function(exports) {
  'use strict';

  window.content = document.getElementById('content');

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== '') {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case 'p':
        case 'page':
          loadContent(pair[1]);
          break;

        default:
          loadContent('home');
          break;
      }
    }
  } else {
    loadContent('home');
  }

  function loadContent(path) {
    var href = '/pages/' + path + '/index.html';

    var client = new XMLHttpRequest();
    client.open('GET', href);
    client.onreadystatechange = function() {
      content.innerHTML = client.responseText;
      importCSS('/pages/' + path + '/style.css');
      importScript('/pages/' + path + '/script.js');
    };
    client.send();
  };

  function importCSS(href) {
    var style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = href;
    content.appendChild(style);
  };

  function importScript(href) {
    var script = document.createElement('script');
    script.async = true;
    script.src = href;
    content.appendChild(script);
  };
})(window);