(function(exports) {
  var teaser = content.querySelector('#teaser');
  var root = document.querySelector(':root');

  document.addEventListener('scroll', function() {
    var scale = 1 + (root.scrollTop / (window.innerHeight / 2));
    var opacity = 1 - (root.scrollTop / (window.innerHeight / 2));

    teaser.style.transform = 'scale(' + scale + ')';
    teaser.style.opacity = opacity;
  })
})(window);