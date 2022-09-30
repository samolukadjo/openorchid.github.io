(function(exports) {
  'use strict';

  var root = document.querySelector(':root');

  setInterval(function() {
    var animateOnView = document.querySelectorAll('[data-scroll-animate]');
    var parallaxAnimation = document.querySelectorAll('[data-scroll-parallax] > *');

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

      parallaxAnimation.forEach(function(element) {
        var y = root.scrollTop - element.parentElement.offsetTop;
        var intensity = (element.parentElement.dataset.scrollParallax || 0);

        element.style.transform = 'translateY(' + (y * intensity) + 'px)';
      });
    };
  }, 1000 / 60);
})(window);