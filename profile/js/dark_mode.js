(function (exports) {
  "use strict";

  var darkModeEnabled = window.top.localStorage.getItem("ws.webstore.darkMode") == "true" ||
                        window.top.localStorage.getItem("ws.articles.darkMode") == "true" ||
                        window.top.localStorage.getItem("ws.chat.darkMode") == "true";
  var root = document.querySelector(":root");

  root.dataset.theme = darkModeEnabled ? "dark" : "light";
  root.dataset.accentScheme = darkModeEnabled ? "light" : "dark";
})(window);
