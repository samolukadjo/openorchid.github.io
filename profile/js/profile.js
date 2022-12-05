(function (exports) {
  "use strict";

  var avatar = document.getElementById('avatar');
  var avatarImage = avatar.querySelector('.main');
  var avatarImageShadow = avatar.querySelector('.shadow');
  var username = document.getElementById('username');
  var badges = document.getElementById('badges');
  var email = document.getElementById('email');
  var phoneNumber = document.getElementById('phone-number');

  avatarImage.onerror = () => {
    avatarImage.src = '/images/profile_pictures/avatar_default.svg';
  };
  avatarImageShadow.onerror = () => {
    avatarImageShadow.src = '/images/profile_pictures/avatar_default.svg';
  };

  function drawMetaBadge(name, bool) {
    if (bool) {
      var element = document.createElement('div');
      element.classList.add('badge');
      element.style.backgroundImage = 'url(images/badges/' + name + '.svg)';
      badges.appendChild(element);

      var tooltip = document.createElement("div");
      tooltip.setAttribute('role', 'title');
      tooltip.classList.add('bottom');
      tooltip.dataset.l10nId = 'badge-' + name;
      element.appendChild(tooltip);
    }
  }

  function init(userId) {
    OrchidServices.getWithUpdate('profile/' + userId, (data) => {
      document.title = data.username + ' - ' + navigator.mozL10n.get('title');

      avatarImage.src = data.profile_picture;
      avatarImage.alt = data.username;
      avatarImageShadow.src = data.profile_picture;
      avatarImageShadow.alt = data.username;
      username.textContent = data.username;
      email.textContent = data.email || navigator.mozL10n.get('none');
      phoneNumber.textContent = data.phone_number || navigator.mozL10n.get('none');

      if (userId == OrchidServices.userId()) {
        document.body.dataset.editmode = true;

        avatar.onclick =  function(evt) {
          evt.preventDefault();
          var fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = ".png,.jpg,.jpeg,.webp,.gif";

          fileInput.addEventListener("change", function () {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function (e) {
              var result = e.target.result;
              compressImage(result, function (image) {
                OrchidServices.set('profile/' + userId, { profile_picture: image });
              });
            });
            reader.readAsDataURL(file);
          });
          fileInput.click();
        };

        username.onclick = () => {
          username.contentEditable = true;
          username.onblur = () => {
            OrchidServices.set('profile/' + userId, { username: username.textContent });
            username.contentEditable = false;
            username.onblur = null;
          };
          username.focus();
          username.onkeydown = (evt) => {
            switch (evt.keyCode) {
              case 13:
                OrchidServices.set('profile/' + userId, { username: username.textContent });
                username.contentEditable = false;
                username.onblur = null;
                break;

              default:
                break;
            }
          };
        };
      } else {
        document.body.dataset.editmode = false;
      }

      badges.innerHTML = '';
      if (data.metadata) {
        drawMetaBadge('verified', data.metadata.is_verified);
        drawMetaBadge('moderator', data.metadata.is_moderator);
        drawMetaBadge('supporter', data.metadata.is_donator);
        drawMetaBadge('developer', data.metadata.is_developer);
      }
    });
  }

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== "") {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case "user_id":
          init(pair[1]);
          break;

        default:
          init(OrchidServices.userId());
          break;
      }
    }
  }
})(window);
