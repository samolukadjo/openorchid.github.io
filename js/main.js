(function(exports) {
  'use strict';

  // Elastic Scrolling
  var root = document.querySelector(':root');
  var contentHolder = document.querySelector('.content-container');
  var header = document.querySelector('.content-container .ws--header');
  var Scrollbar = window.Scrollbar;

  Scrollbar.use(window.OverscrollPlugin);
  window.elasticScrollbar = Scrollbar.init(contentHolder, {
    plugins: {
      overscroll: true
    }
  });

  elasticScrollbar.addListener(() => {
    if (elasticScrollbar.offset.y >= header.offsetTop) {
      header.style.transform = 'translateY(' + (elasticScrollbar.offset.y - header.offsetTop) + 'px)';
      header.classList.add('scrolling');
    } else {
      header.style.transform = 'translateY(0px)';
      header.classList.remove('scrolling');
    }
  });

  var content = document.getElementById('content');
  var optionsButton = document.getElementById('options-button');
  var profileButton = document.getElementById('profile-button');
  var profileAvatar = document.getElementById('profile-avatar');
  var profileTooltip = document.getElementById('profile-tooltip');

  var notifications = document.getElementById('notifications');
  var notificationsButton = document.getElementById('notifications-button');
  var notificationsList = document.getElementById('notifications-list');
  var notificationsClearAllButton = document.getElementById('notifications-clear-all-button');
  var notificationsCloseButton = document.getElementById('notifications-close-button');
  var notificationsEmpty = document.getElementById('notifications-empty');

  content.addEventListener('click', () => {
    notifications.classList.remove('visible');
    root.style.overflow = '';
  });
  notificationsButton.addEventListener('click', () => {
    notifications.classList.toggle('visible');
    if (notifications.classList.contains('visible')) {
      root.style.overflow = 'hidden';
    } else {
      root.style.overflow = '';
    }
  });
  notificationsCloseButton.addEventListener('click', () => {
    notifications.classList.remove('visible');
    root.style.overflow = '';
  });
  notificationsClearAllButton.addEventListener('click', () => {
    OrchidServices.set('profile/' + OrchidServices.userId(), { notifications: [] });
    notificationsEmpty.style.display = '';
  });

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

        notificationsList.innerHTML = '';
        if (data.notifications.length == 0) {
          notificationsEmpty.style.display = '';
        } else {
          notificationsEmpty.style.display = 'none';
        }

        data.notifications.forEach(item => {
          var element = document.createElement('li');
          element.dataset.origin = item.open;
          notificationsList.appendChild(element);
          element.addEventListener('click', () => {
            window.open(item.open);
          });

          var iconHolder = document.createElement('div');
          iconHolder.classList.add('icon-holder');
          element.appendChild(iconHolder);

          var icon = document.createElement('img');
          icon.classList.add('icon');
          icon.src = item.icon;
          icon.alt = item.title;
          iconHolder.appendChild(icon);

          var context = document.createElement('div');
          context.classList.add('context');
          element.appendChild(context);

          var title = document.createElement('span');
          title.classList.add('title');
          title.textContent = item.title;
          context.appendChild(title);

          var detail = document.createElement('span');
          detail.classList.add('detail');
          detail.textContent = item.detail;
          context.appendChild(detail);
        });
      });

      optionsButton.style.display = 'none';
    } else {
      profileButton.style.display = 'none';
      notificationsButton.style.display = 'none';
    }
  });
})(window);