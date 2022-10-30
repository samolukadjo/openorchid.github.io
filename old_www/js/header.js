'use strict';

import { isUserLoggedIn, loginId, getDBItem, openLoginPrompt } from "./firebase.js";

(function() {
  var header = document.getElementById('header');

  document.addEventListener('scroll', function() {
    if (document.scrollingElement.scrollTop >= 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // Login
  var avatar = document.getElementById('header-avatar');
  var notLoggedIn = document.getElementById('header-notloggedin');

  if (isUserLoggedIn) {
    getDBItem('users/' + loginId + '/profile_picture', function(data) {
      avatar.style.backgroundImage = 'url(' + data + ')';
    });
    getDBItem('users/' + loginId + '/username', function(data) {
      avatar.title = data;
    });
    notLoggedIn.style.display = 'none';
    avatar.style.display = null;
  } else {
    notLoggedIn.style.display = null;
    avatar.style.display = 'none';
  }

  // Login buttons
  var login = document.getElementById('header-login');
  var signup = document.getElementById('header-signup');

  login.addEventListener('click', function() {
    openLoginPrompt('login', function() {
      notLoggedIn.style.display = 'none';
      avatar.style.display = null;

      getDBItem('users/' + loginId + '/profile_picture', function(data) {
        avatar.style.backgroundImage = 'url(' + data + ')';
      });
      getDBItem('users/' + loginId + '/username', function(data) {
        avatar.title = data;
      });
    });
  });
  signup.addEventListener('click', function() {
    openLoginPrompt('signup', function() {
      notLoggedIn.style.display = 'none';
      avatar.style.display = null;

      getDBItem('users/' + loginId + '/profile_picture', function(data) {
        avatar.style.backgroundImage = 'url(' + data + ')';
      });
      getDBItem('users/' + loginId + '/username', function(data) {
        avatar.title = data;
      });
    });
  });

  // Account Options
  var isDarkMode = (localStorage.getItem('dark_mode') === 'true');
  dropdown(avatar, function(element) {
    element.innerHTML = `
      <header class="username"></header>
      <a href="?p=account" data-l10n-id="account-settings" data-icon="user">Account Settings</a>
      <a href="devices/index.html" data-l10n-id="account-devices" data-icon="sync">My Devices</a>
      <label>
        <input type="checkbox" class="dark-mode">
        <span data-l10n-id="dark-mode">Dark Mode</span>
      </label>
      <a href="#" class="account-logout" data-l10n-id="account-logout" data-icon="email-forward">Log Out</a>
    `;

    var username = element.querySelector('.username');
    getDBItem('users/' + loginId + '/username', function(data) {
      username.innerText = data;
    });

    var darkMode = element.querySelector('.dark-mode');
    darkMode.checked = isDarkMode;
    darkMode.addEventListener('change', function() {
      localStorage.setItem('dark_mode', darkMode.checked);
      document.body.classList.toggle('dark-mode-enabled');
    });

    var accountLogout = element.querySelector('.account-logout');
    accountLogout.addEventListener('click', function() {
      delete localStorage.wos_login;
      notLoggedIn.style.display = null;
      avatar.style.display = 'none';
      element.classList.remove('visible');
    });
  })
})();
