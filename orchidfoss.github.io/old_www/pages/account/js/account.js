'use strict';

import { loginId, getDBItem, setDBItem } from "/js/firebase.js";

(function() {
  var isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (isDarkMode) {
    document.body.classList.add('dark-mode-enabled');
  }

  var openButtons = document.querySelectorAll('[data-open]');
  openButtons.forEach(function(node) {
    node.addEventListener('click', function() {
      var openContent = document.querySelector('[role="region"]:not(#root).visible');
      if (openContent) {
        openContent.classList.remove('visible');
      }
      var openButton = document.querySelector('ul li.selected');
      if (openButton) {
        openButton.classList.remove('selected');
      }

      if (node.dataset.open !== 'root') {
        var unopenContent = document.getElementById(node.dataset.open);
        unopenContent.classList.add('visible');
        node.classList.add('selected');
      }
    });
  });

  if (window.matchMedia('(min-width: 768px)').matches) {
    var firstContent = document.getElementById('personal');
    firstContent.classList.add('visible');

    var openButton = document.querySelector('[data-open="personal"]');
    openButton.classList.add('selected');
  }

  window.addEventListener('resize', function() {
    if (window.matchMedia('(min-width: 768px)').matches) {
      var firstContent = document.getElementById('personal');
      firstContent.classList.add('visible');

      var openButton = document.querySelector('[data-open="personal"]');
      openButton.classList.add('selected');
    }
  });

  // Account
  var avatar = document.getElementById('avatar');
  var username = document.getElementById('username');
  var badges = document.getElementById('badges');
  var dateCreated = document.getElementById('date-created');
  var phoneNumber = document.getElementById('phone-number');
  var description = document.getElementById('description');

  var verificationBadge = document.createElement('div');
  verificationBadge.classList.add('verified');
  verificationBadge.dataset.l10nId = 'badge-verified';
  badges.appendChild(verificationBadge);

  var moderationBadge = document.createElement('div');
  moderationBadge.classList.add('moderator');
  moderationBadge.dataset.l10nId = 'badge-moderator';
  badges.appendChild(moderationBadge);

  var developerBadge = document.createElement('div');
  developerBadge.classList.add('developer');
  developerBadge.dataset.l10nId = 'badge-developer';
  badges.appendChild(developerBadge);

  var supporterBadge = document.createElement('div');
  supporterBadge.classList.add('supporter');
  supporterBadge.dataset.l10nId = 'badge-supporter';
  badges.appendChild(supporterBadge);

  getDBItem('users/' + loginId + '/profile_picture', function(data) {
    avatar.src = data;
  });
  getDBItem('users/' + loginId + '/username', function(data) {
    avatar.title = data;
    username.innerText = data;
  });

  getDBItem('users/' + loginId + '/is_verified', function(data) {
    console.log('Is user verified? ' + data);
    if (data) {
      verificationBadge.classList.add('visible');
    } else {
      verificationBadge.classList.remove('visible');
    }
  });
  getDBItem('users/' + loginId + '/is_moderator', function(data) {
    console.log('Is user a moderator? ' + data);
    if (data) {
      moderationBadge.classList.add('visible');
    } else {
      moderationBadge.classList.remove('visible');
    }
  });
  getDBItem('users/' + loginId + '/is_developer', function(data) {
    console.log('Is user a developer? ' + data);
    if (data) {
      developerBadge.classList.add('visible');
    } else {
      developerBadge.classList.remove('visible');
    }
  });
  getDBItem('users/' + loginId + '/is_supporter', function(data) {
    console.log('Is user a supporter? ' + data);
    if (data) {
      supporterBadge.classList.add('visible');
    } else {
      supporterBadge.classList.remove('visible');
    }
  });

  getDBItem('users/' + loginId + '/date_created', function(data) {
    var date = new Date(data);
    var formatted = date.getUTCFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getUTCDate() + ' - ' + date.getUTCHours() + ':' + date.getMinutes();
    dateCreated.innerText = formatted;
  });
  getDBItem('users/' + loginId + '/phone_number', function(data) {
    phoneNumber.innerText = data;
  });
  getDBItem('users/' + loginId + '/description', function(data) {
    description.innerText = data;
  });

  avatar.onclick = function() {
    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.png,.jpg,.jpeg,.webp';

    fileInput.addEventListener('change', function() {
      var file = fileInput.files[0];
      var reader  = new FileReader();
      reader.addEventListener('load', function(e) {
        var result = e.target.result;
        resizeImage(result, 64, 64, function(image) {
          setDBItem('users/' + loginId + '/profile_picture', image);
        });
      });
      reader.readAsDataURL(file);
    });
    fileInput.click();
  };
  username.onclick = function() {
    getDBItem('users/' + loginId + '/username', function(data) {
      var promptBox = prompt('Enter your new name', data);
      if (promptBox !== null && promptBox !== '') {
        setDBItem('users/' + loginId + '/username', promptBox);
      }
    });
  };
  phoneNumber.parentElement.onclick = function() {
    getDBItem('users/' + loginId + '/phone_number', function(data) {
      var promptBox = prompt('Enter your phone number', data);
      if (promptBox !== null && promptBox !== '') {
        setDBItem('users/' + loginId + '/phone_number', promptBox);
      }
    });
  };
  description.onclick = function() {
    getDBItem('users/' + loginId + '/description', function(data) {
      var promptBox = prompt('Enter your new description', data);
      if (promptBox !== null && promptBox !== '') {
        setDBItem('users/' + loginId + '/description', promptBox);
      }
    });
  };

  // Avatars
  var avatars = document.querySelectorAll('#avatars ul li img');
  avatars.forEach(function(avatarChoice) {
    if (avatarChoice.id == 'custom-avatar') {
      avatarChoice.addEventListener('click', function() {
        var fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = '.png,.jpg,.jpeg,.webp';
        fileInput.click();
        fileInput.addEventListener('change', function() {
          resizeImage(fileInput.files[0], 64, 64, function(image) {
            setDBItem('users/' + loginId + '/profile_picture', image);
          });
        });
      });
    } else {
      avatarChoice.addEventListener('click', function() {
        resizeImage(avatarChoice.src, 64, 64, function(image) {
          setDBItem('users/' + loginId + '/profile_picture', image);
        });
      });
    }
  });
})();
