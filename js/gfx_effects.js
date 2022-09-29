(function(exports) {
  'use strict';

  var root = document.querySelector(':root');

  setInterval(function() {
    var animateOnView = document.querySelectorAll('[data-scroll-animate]');

    document.onscroll = function() {
      animateOnView.forEach(function(element) {
        var y = root.scrollTop + element.getBoundingClientRect().top - window.innerHeight;
        var height = element.getBoundingClientRect().height;

        if (root.scrollTop >= (y + height)) {
          element.classList.add('visible');
        } else {
          element.classList.remove('visible');
        }
      });
    };
  }, 1000 / 60);
})(window);