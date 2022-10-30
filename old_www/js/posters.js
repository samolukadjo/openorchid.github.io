'use strict';

window.addEventListener('load', function() {
  var _index = 0;
  var intervalDuration = 5000;

  var posters = document.getElementById('posters');
  var posterContainer = posters.querySelector('.container');
  var posterDots = posters.querySelector('.dots');

  var posterBack = posters.querySelector('.back');
  var posterForward = posters.querySelector('.forward');

  if (window.top) {
    if (window.top.matchMedia('(orientation: landscape)')) {
      posters.style.height = (window.top.innerHeight - 120) + 'px';
      posterBack.style.lineHeight = (window.top.innerHeight - 120) + 'px';
      posterForward.style.lineHeight = (window.top.innerHeight - 120) + 'px';
      window.top.addEventListener('resize', function() {
        posters.style.height = (window.top.innerHeight - 120) + 'px';
        posterBack.style.lineHeight = (window.top.innerHeight - 120) + 'px';
        posterForward.style.lineHeight = (window.top.innerHeight - 120) + 'px';
      });
    } else {
      posters.style.height = (window.top.innerHeight / 3) + 'px';
      posterBack.style.lineHeight = (window.top.innerHeight / 3) + 'px';
      posterForward.style.lineHeight = (window.top.innerHeight / 3) + 'px';
      window.top.addEventListener('resize', function() {
        posters.style.height = (window.top.innerHeight / 3) + 'px';
        posterBack.style.lineHeight = (window.top.innerHeight / 3) + 'px';
        posterForward.style.lineHeight = (window.top.innerHeight / 3) + 'px';
      });
    }
  }

  posterBack.onclick = function() {
    var currentPoster = posters.querySelector('.current');
    var previousPoster = currentPoster.previousElementSibling || posters.querySelector('.previous');
    var nextPoster = currentPoster.nextElementSibling || posters.querySelector('.next');
    var currentDot = posterDots.querySelector('.current');

    currentPoster.classList.remove('current');
    currentPoster.classList.add('next');
    nextPoster.classList.remove('next');
    nextPoster.classList.add('previous');
    previousPoster.classList.remove('previous');
    previousPoster.classList.add('current');

    var imageUrl = previousPoster.querySelector('img').src;
    if (lightOrDark(colorPicker(imageUrl)) == 'light') {
      posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 0.1})[0]);
      posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 0.3})[1]);
      posters.style.setProperty('--color-overlay', colorPicker(imageUrl));
    } else {
      posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 1.8})[0]);
      posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 1.3})[1]);
      posters.style.setProperty('--color-overlay', colorPicker(imageUrl));
    }

    currentDot.classList.remove('current');
    if (currentDot.previousElementSibling) {
      currentDot.previousElementSibling.classList.add('current');
    } else {
      posterDots.children[posterDots.children.length - 1].classList.add('current');
    }
  }; 

  posterForward.onclick = function() {
    var currentPoster = posters.querySelector('.current');
    var previousPoster = currentPoster.previousElementSibling || posters.querySelector('.previous');
    var nextPoster = currentPoster.nextElementSibling || posters.querySelector('.next');
    var currentDot = posterDots.querySelector('.current');

    currentPoster.classList.remove('current');
    currentPoster.classList.add('previous');
    nextPoster.classList.remove('next');
    nextPoster.classList.add('current');

    var imageUrl = nextPoster.querySelector('img').src;
    if (lightOrDark(colorPicker(imageUrl)) == 'light') {
      posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 0.15})[0]);
      posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 0.3})[1]);
      posters.style.setProperty('--color-overlay', colorPicker(imageUrl));
    } else {
      posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 1.75})[0]);
      posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 1.5})[1]);
      posters.style.setProperty('--color-overlay', colorPicker(imageUrl));
    }

    previousPoster.classList.remove('previous');
    previousPoster.classList.add('next');

    currentDot.classList.remove('current');
    if (currentDot.nextElementSibling) {
      currentDot.nextElementSibling.classList.add('current');
    } else {
      posterDots.children[0].classList.add('current');
    }
  };

  var currentPoster = posters.querySelector('.current');
  var currentDot = posterDots.querySelector('.current');

  var imageUrl = currentPoster.querySelector('img').src;
  if (lightOrDark(colorPicker(imageUrl)) == 'light') {
    posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 0.1})[0]);
    posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 0.3})[1]);
    posters.style.setProperty('--color-overlay', colorPicker(imageUrl));
  } else {
    posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 1.8})[0]);
    posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 1.3})[1]);
    posters.style.setProperty('--color-overlay', colorPicker(imageUrl));
  }

  var millisecond = 0;
  var progress = setInterval(function() {
    if (millisecond <= intervalDuration) {
      if (currentDot.nextElementSibling) {
        currentDot.nextElementSibling.style.setProperty('--time-progress',
            ((millisecond / intervalDuration) * 100) + '%');
      } else {
        posterDots.children[0].style.setProperty('--time-progress',
           ((millisecond / intervalDuration) * 100) + '%');
      }
      millisecond += 10;
    }
  }, 10);
  if (millisecond >= intervalDuration) {
    progress.stop();
  }

  function update() {
    var currentPoster = posters.querySelector('.current');
    var previousPoster = currentPoster.previousElementSibling || posters.querySelector('.previous');
    var nextPoster = currentPoster.nextElementSibling || posters.querySelector('.next');
    var currentDot = posterDots.querySelector('.current');

    currentPoster.classList.remove('current');
    currentPoster.classList.add('previous');
    nextPoster.classList.remove('next');
    nextPoster.classList.add('current');

    var imageUrl = nextPoster.querySelector('img').src;
    if (lightOrDark(colorPicker(imageUrl)) == 'light') {
      posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 0.1})[0]);
      posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 0.3})[1]);
      posters.style.setProperty('--color-overlay', colorPicker(imageUrl));
    } else {
      posters.style.setProperty('--color-primary', colorPicker(imageUrl, {colors: 2, brightness: 1.8})[0]);
      posters.style.setProperty('--color-secondary', colorPicker(imageUrl, {colors: 2, brightness: 1.3})[1]);
      posters.style.setProperty('--color-overlay', colorPicker(imageUrl));
    }

    var millisecond = 0;
    var progress = setInterval(function() {
      if (millisecond <= intervalDuration) {
        if (currentDot.nextElementSibling) {
          currentDot.nextElementSibling.style.setProperty('--time-progress',
              ((millisecond / intervalDuration) * 100) + '%');
        } else {
          posterDots.children[0].style.setProperty('--time-progress',
             ((millisecond / intervalDuration) * 100) + '%');
        }
        millisecond += 10;
      }
    }, 10);
    if (millisecond >= intervalDuration) {
      progress.stop();
    }

    previousPoster.classList.remove('previous');
    previousPoster.classList.add('next');

    currentDot.classList.remove('current');
    if (currentDot.nextElementSibling) {
      currentDot.nextElementSibling.classList.add('current');
    } else {
      posterDots.children[0].classList.add('current');
    }
  }

  setInterval(function() {
    update();
  }, intervalDuration);
});
