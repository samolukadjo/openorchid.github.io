(function(exports) {
  'use strict';

  var root = document.querySelector(':root');
  var header = document.querySelector('.ws--header');

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

  // var loginButton = document.getElementById('login-button');
  // loginButton.addEventListener('click', () => {
  //   var win = window.open('/auth/index.html', '_blank', 'width=854,height=480');
  // });

  // Ripple effect
  function createRipple(button) {
    const circle = document.createElement("span");

    button.addEventListener("mousedown", (event) => {
      const diameter = Math.max(button.getBoundingClientRect().width, button.getBoundingClientRect().height);
      const radius = diameter / 2;

      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
      circle.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
      circle.classList.add("ripple");
      circle.classList.add("active");

      button.appendChild(circle);
      button.style.overflow = 'hidden';
    });

    button.addEventListener("mouseup", () => {
      circle.classList.remove("ripple");
      circle.classList.remove("active");
      setTimeout(() => {
        circle.classList.add("ripple");
      });
      circle.addEventListener('animationend', () => {
        circle.remove();
        button.style.overflow = '';
      });
    });
  }

  const buttons = document.querySelectorAll("a[href], button, #notifications-list li");
  for (const button of buttons) {
    createRipple(button);
  }
})(window);