(function(exports) {
  var teaser = content.querySelector('#teaser');

  elasticScrollbar.addListener(function() {
    var scale = 1 + (elasticScrollbar.offset.y / (window.innerHeight / 2));
    var opacity = 1 - (elasticScrollbar.offset.y / (window.innerHeight / 2));

    if (elasticScrollbar.offset.y <= window.innerHeight) {
      teaser.style.transform = 'scale(' + scale + ')';
      teaser.style.opacity = opacity;
    }
  });

  var trailerButton = content.querySelector('#trailer-button');

  trailerButton.onclick = function() {
    openVideoPlayer('/videos/trailer.mp4');
  };
})(window);