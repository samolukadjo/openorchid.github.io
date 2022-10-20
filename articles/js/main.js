(function(exports) {
  'use strict';

  var profileButton = document.getElementById('profile-button');
  var profileAvatar = document.getElementById('profile-avatar');
  var profileTooltip = document.getElementById('profile-tooltip');

  window.addEventListener('load', function() {
    if (OrchidServices.isUserLoggedIn()) {
      OrchidServices.getWithUpdate('profile/' + OrchidServices.userId(), function(data) {
        profileTooltip.textContent = data.username;
        profileAvatar.alt = data.username;
        if (data.profile_picture !== '') {
          profileAvatar.src = data.profile_picture;
        } else {
          profileAvatar.src = '/images/profile_pictures/avatar_default.svg';
        }
      });
    } else {
      profileButton.style.display = 'none';
    }
  });
})(window);