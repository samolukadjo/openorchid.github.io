(function(exports) {
  'use strict';

  var root = document.querySelector(':root');
  var videoContainer = document.getElementById('video-player');
  var videoElement = document.getElementById('video-player-content');
  var videoSourceElement = document.getElementById('video-player-source');
  var closeButton = document.getElementById('video-player-close');

  closeButton.onclick = function() {
    videoContainer.classList.remove('visible');
    root.style.overflow = '';
  };

  function VideoPlayer(url) {
    root.style.overflow = 'hidden';
    videoContainer.classList.add('visible');
    videoSourceElement.setAttribute('src', url);
    videoElement.play();
  }

  exports.openVideoPlayer = VideoPlayer;
})(window);