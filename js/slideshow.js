async function initSlideshow() {
  'use strict';

  var progress = 0;
  var isPaused = false;
  var slideshowContainer = document.getElementById('slideshow');
  var slideshowPosters = slideshowContainer.querySelector('.holder');
  var backButton = slideshowContainer.querySelector('.controls .back');
  var forwardButton = slideshowContainer.querySelector('.controls .forward');
  var slideshowDots = slideshowContainer.querySelector('.dots');
  var playPauseButton = slideshowContainer.querySelector('.playpause-button');

  var client = new XMLHttpRequest();
  client.open('GET', '/assets/slideshow.json');
  client.onreadystatechange = function () {
    var json = JSON.parse(client.responseText);
    console.log(json);

    slideshowDots.innerHTML = '';
    slideshowPosters.innerHTML = '';
    init(json);
  };
  client.send();

  function init(json) {
    json.forEach((slideshow, index) => {
      var dot = document.createElement('div');
      dot.classList.add('dot');
      slideshowDots.appendChild(dot);
      dot.addEventListener('click', () => {
        var selectedDot = slideshowDots.querySelector('.active');
        var selectedSlideshow = slideshowPosters.querySelector('.current');
        if (selectedSlideshow) {
          selectedDot.classList.remove('active');
          selectedSlideshow.classList.remove('current');
        }
        dot.classList.add('active');
        element.classList.add('current');
        updateSlideshowVideo();
      });

      var dotLabel = document.createElement('span');
      dotLabel.classList.add('label');
      dotLabel.dataset.l10nId = slideshow.title;
      dot.appendChild(dotLabel);

      var dotProgress = document.createElement('div');
      dotProgress.classList.add('progress');
      dot.appendChild(dotProgress);

      var element = document.createElement('div');
      element.classList.add('slideshow');
      slideshowPosters.appendChild(element);

      if (index == 0) {
        dot.classList.add('active');
        element.classList.add('current');
      }

      if (slideshow.background) {
        if (slideshow.background.endsWith('.mp4')) {
          var background = document.createElement('video');
          background.src = slideshow.background;
          background.classList.add('background');
          element.appendChild(background);
        } else {
          var background = document.createElement('img');
          background.src = slideshow.background;
          background.alt = slideshow.title;
          background.classList.add('background');
          element.appendChild(background);

          background.onload = () => {
            setTimeout(() => {
              colorPicker(slideshow.background, { colors: 2 }).then(
                (colors) => {
                  element.style.setProperty('--color-primary', colors[0]);
                  dot.style.setProperty('--color-primary', colors[0]);

                  switch (lightOrDark(colors[0])) {
                    case 'light':
                      colorPicker(slideshow.background, {
                        colors: 2,
                        brightness: 0.25,
                      }).then((colors) => {
                        element.style.setProperty(
                          '--color-secondary',
                          colors[1]
                        );
                        dot.style.setProperty('--color-secondary', colors[1]);
                      });
                      break;

                    case 'dark':
                      colorPicker(slideshow.background, {
                        colors: 2,
                        brightness: 1.75,
                      }).then((colors) => {
                        element.style.setProperty(
                          '--color-secondary',
                          colors[1]
                        );
                        dot.style.setProperty('--color-secondary', colors[1]);
                      });
                      break;
                  }
                }
              );
            }, 250);
          };
        }
      }

      var content = document.createElement('div');
      element.appendChild(content);

      if (slideshow.title) {
        var title = document.createElement('h1');
        title.dataset.l10nId = slideshow.title;
        title.classList.add('title');
        content.appendChild(title);
      }

      if (slideshow.detail) {
        var detail = document.createElement('p');
        detail.dataset.l10nId = slideshow.detail;
        detail.classList.add('detail');
        content.appendChild(detail);
      }

      if (slideshow.link_to) {
        var hyperlink = document.createElement('a');
        hyperlink.href = slideshow.link_to;
        hyperlink.classList.add('hyperlink');
        content.appendChild(hyperlink);

        var linkLabel = document.createElement('span');
        hyperlink.appendChild(linkLabel);

        if (slideshow.link_to.startsWith(location.origin)) {
          linkLabel.dataset.l10nId = 'learn-more';
        } else {
          linkLabel.dataset.l10nId = 'visit-site';
        }
      }
    });
  }

  function updateSlideshowVideo() {
    var videos = slideshowPosters.querySelectorAll('video');
    videos.forEach((video) => {
      video.pause();
    });

    if (!isPaused) {
      // The video of the element we switched to
      var selectedSlideshowVideo =
        slideshowPosters.querySelector('.current video');
      if (selectedSlideshowVideo) {
        selectedSlideshowVideo.currentTime = 0;
        selectedSlideshowVideo.play();
      }
      playPauseButton.dataset.icon = 'pause';
    } else {
      playPauseButton.dataset.icon = 'play';
    }
  }

  function move(index) {
    var selectedDot = slideshowDots.querySelector('.active');
    var selectedSlideshow = slideshowPosters.querySelector('.current');

    if (index == 1) {
      if (selectedSlideshow) {
        if (selectedSlideshow.nextElementSibling) {
          selectedDot.classList.remove('active');
          selectedDot.nextElementSibling.classList.add('active');
          selectedSlideshow.classList.remove('current');
          selectedSlideshow.nextElementSibling.classList.add('current');
          updateSlideshowVideo();
        } else {
          if (slideshowPosters.firstChild) {
            selectedDot.classList.remove('active');
            slideshowDots.firstChild.classList.add('active');
            selectedSlideshow.classList.remove('current');
            slideshowPosters.firstChild.classList.add('current');
            updateSlideshowVideo();
          }
        }
      }
    }

    if (index == -1) {
      if (selectedSlideshow) {
        if (selectedSlideshow.previousElementSibling) {
          selectedDot.classList.remove('active');
          selectedDot.previousElementSibling.classList.add('active');
          selectedSlideshow.classList.remove('current');
          selectedSlideshow.previousElementSibling.classList.add('current');
          updateSlideshowVideo();
        } else {
          if (slideshowPosters.lastChild) {
            selectedDot.classList.remove('active');
            slideshowDots.lastChild.classList.add('active');
            selectedSlideshow.classList.remove('current');
            slideshowPosters.lastChild.classList.add('current');
            updateSlideshowVideo();
          }
        }
      }
    }
  }

  slideshowContainer.addEventListener('mouseenter', () => {
    isPaused = true;
    updateSlideshowVideo();
  });
  slideshowContainer.addEventListener('mouseleave', () => {
    isPaused = false;
    updateSlideshowVideo();
  });
  playPauseButton.addEventListener('click', () => {
    isPaused = !isPaused;
    updateSlideshowVideo();
  });
  backButton.addEventListener('click', () => {
    move(-1);
  });
  forwardButton.addEventListener('click', () => {
    move(1);
  });

  setInterval(() => {
    if (!isPaused) move(1);
  }, 4000);
}
