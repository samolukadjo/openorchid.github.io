(function(exports) {
  'use strict';

  var root = document.querySelector(':root');
  var header = document.getElementById('header');

  var previousY = 0;
  document.addEventListener('scroll', () => {
    if (root.scrollTop <= previousY || root.scrollTop <= 51) {
      header.classList.add('visible');
    } else if (root.scrollTop >= previousY) {
      header.classList.remove('visible');
    }

    if (root.scrollTop >= 5) {
      header.classList.add('scrolling');
    } else {
      header.classList.remove('scrolling');
    }
    previousY = root.scrollTop;
  });

  var content = document.getElementById('content');
  var optionsButton = document.getElementById('options-button');
  var profileButton = document.getElementById('profile-button');
  var profileAvatar = document.getElementById('profile-avatar');
  var profileTooltip = document.getElementById('profile-tooltip');

  content.addEventListener('click', () => {
    root.style.overflow = '';
  });

  window.addEventListener('load', function() {
    AOS.init();

    if (OrchidServices.isUserLoggedIn()) {
      profileButton.href = 'https://orchidfoss.github.io/profile/?user_id=' + OrchidServices.userId();
      OrchidServices.getWithUpdate('profile/' + OrchidServices.userId(), function(data) {
        profileTooltip.textContent = data.username;
        profileAvatar.alt = data.username;
        if (data.profile_picture !== '') {
          profileAvatar.src = data.profile_picture;
        } else {
          profileAvatar.src = '/images/profile_pictures/avatar_default.svg';
        }
      });

      optionsButton.style.display = 'none';
    } else {
      profileButton.style.display = 'none';
    }
  });
})(window);