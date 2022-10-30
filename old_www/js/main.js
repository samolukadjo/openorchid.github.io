'use strict';

import { loginId, getDBItem, setDBItem, isUserLoggedIn } from "./firebase.js";

(function() {
  var isDarkMode = (localStorage.getItem('dark_mode') === 'true');
  if (isDarkMode) {
    document.body.classList.add('dark-mode-enabled');
  }
  var darkMode = document.getElementById('dark-mode');
  darkMode.checked = isDarkMode;
  darkMode.addEventListener('change', function() {
    localStorage.setItem('dark_mode', darkMode.checked);
    document.body.classList.toggle('dark-mode-enabled');
  });

  window.addEventListener('load', function() {
    setTimeout(function() {
      navigator.mozL10n.language.code =
        (localStorage.getItem('language') !== undefined ?
            localStorage.getItem('language') : (navigator.language || 'en-US'));
      if (languageSelector) {
        languageSelector.value =
          (localStorage.getItem('language') !== undefined ?
              localStorage.getItem('language') : (navigator.language || 'en-US'));
      }
    });
  });

  var languageSelector = document.getElementById('languages');
  if (languageSelector) {
    languageSelector.addEventListener('change', function() {
      navigator.mozL10n.language.code = languageSelector.value;
      localStorage.setItem('language', languageSelector.value);
    });
  }

  var frame = document.getElementById('content');
  if (frame.contentWindow && frame.contentDocument) {
    frame.addEventListener('load', function() {
      setInterval(function() {
        var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (isDarkMode) {
          frame.contentDocument.body.classList.add('dark-mode-enabled');
        }

        frame.contentWindow.navigator.mozL10n.language.code =
          (localStorage.getItem('language') !== undefined ?
              localStorage.getItem('language') : (navigator.language || 'en-US'));
      }, 1000);
    });
  }

  if (location.search !== '') {
    var pramaters = location.search.split('?')[1];
    let params_arr = pramaters.split('&');
    for (let i = 0; i < params_arr.length; i++) {
      let pair = params_arr[i].split('=');
      if (pair[0] == 'p') {
        if (pair[1]) {
          frame.src = 'pages/' + pair[1] + '/index.html';
          frame.addEventListener('load', function() {
            setInterval(function() {
              if (frame.contentDocument) {
                frame.style.height = frame.contentDocument.scrollingElement.scrollHeight + 'px';
              }
            }, 1000);
          });
        }
      } else if (pair[0] == 'blog') {
        if (pair[1]) {
          frame.src = 'https://woslinux.github.io/blog/' + pair[1];
          frame.addEventListener('load', function() {
            setInterval(function() {
              if (frame.contentDocument) {
                frame.style.height = frame.contentDocument.scrollingElement.scrollHeight + 'px';
              }
            }, 1000);
          });
        }
      }
    }
  } else {
    frame.src = 'pages/index/index.html';
    frame.addEventListener('load', function() {
      setInterval(function() {
        if (frame.contentDocument) {
          frame.style.height = frame.contentDocument.scrollingElement.scrollHeight + 'px';
        }
      }, 1000);
    });
  }

  window.importJS = function(url) {
    var script = document.createElement('script');
    script.type = 'module';
    script.src = url;
    frame.appendChild(script);
  };
})();
