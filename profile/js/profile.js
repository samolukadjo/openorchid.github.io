(function (exports) {
  "use strict";

  exports.EnglishToArabicNumerals = function EnglishToArabicNumerals(
    numberString
  ) {
    var arabicNumerals = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];
    if (document.dir == "rtl") {
      return numberString
        .toLocaleString(navigator.mozL10n.language.code)
        .replace(/[0-9]/g, function (w) {
          return arabicNumerals[+w];
        });
    } else {
      return numberString;
    }
  };

  var banner = document.getElementById("banner");
  var bannerImage = document.getElementById("banner-image");
  var avatar = document.getElementById("avatar");
  var avatarImage = avatar.querySelector(".main");
  var avatarImageShadow = avatar.querySelector(".shadow");
  var username = document.getElementById("username");
  var badges = document.getElementById("badges");
  var email = document.getElementById("email");
  var createdAt = document.getElementById("created-at");
  var lastActive = document.getElementById("last-active");
  var description = document.getElementById("description");
  var descriptionEmpty = document.getElementById("description-empty");
  var descriptionHolder = document.getElementById("description-holder");
  var phoneNumber = document.getElementById("phone-number");
  var phoneNumberHolder = document.getElementById("phone-number-holder");
  var addFriendButton = document.getElementById("add-friend-button");
  var followButton = document.getElementById("follow-button");

  const parallaxElements = [bannerImage];
  const parallax = function(img) {
    const speed = 3;
    let pos = (document.body.scrollTop / speed) + "px";
    img.style.transform = `translateY(${pos})`;
  }
  document.body.addEventListener('scroll', function(e) {
    parallaxElements.forEach( (img) => {
      parallax(img);
    });
  });

  bannerImage.onerror = () => {
    bannerImage.style.display = "none";
  };
  bannerImage.onload = () => {
    bannerImage.style.display = "block";
  };

  avatarImage.onerror = () => {
    avatarImage.src = "/images/profile_pictures/avatar_default.svg";
  };
  avatarImageShadow.onerror = () => {
    avatarImageShadow.src = "/images/profile_pictures/avatar_default.svg";
  };

  function drawMetaBadge(name, bool) {
    if (bool) {
      var element = document.createElement("div");
      element.classList.add("badge");
      element.style.backgroundImage = "url(images/badges/" + name + ".svg)";
      badges.appendChild(element);

      var tooltip = document.createElement("div");
      tooltip.setAttribute("role", "title");
      tooltip.classList.add("bottom");
      tooltip.dataset.l10nId = "badge-" + name;
      element.appendChild(tooltip);
    }
  }

  function init(userId) {
    OrchidServices.getWithUpdate("profile/" + userId, (data) => {
      document.title = data.username + " - " + navigator.mozL10n.get("title");

      if (data.is_business) {
        document.body.classList.add('business');
      } else {
        document.body.classList.remove('business');
      }
      document.body.dataset.state = data.state || 'offline';

      bannerImage.src = data.banner_image;
      avatarImage.src = data.profile_picture;
      avatarImage.alt = data.username;
      avatarImageShadow.src = data.profile_picture;
      avatarImageShadow.alt = data.username;
      username.textContent = data.username;
      email.textContent = data.email || navigator.mozL10n.get("none");
      phoneNumber.textContent =
        data.phone_number || navigator.mozL10n.get("none");

      createdAt.textContent = new Date(data.time_created).toLocaleDateString(navigator.mozL10n.language.code, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      lastActive.textContent = new Date(data.last_active).toLocaleDateString(navigator.mozL10n.language.code, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        hour12: true
      });

      if (data.description) {
        description.innerText = data.description;
        descriptionEmpty.style.display = 'none';
      } else {
        description.innerText = '';
        descriptionEmpty.style.display = 'block';
      }

      if (data.token == OrchidServices.userId()) {
        document.body.dataset.editmode = true;

        banner.onclick = function (evt) {
          evt.preventDefault();
          var fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = ".png,.jpg,.jpeg,.webp,.gif";

          fileInput.addEventListener("change", function () {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function (e) {
              var result = e.target.result;
              compressImage(result, 1280, 432, function (image) {
                OrchidServices.set("profile/" + userId, {
                  banner_image: image,
                });
              });
            });
            reader.readAsDataURL(file);
          });
          fileInput.click();
        };

        avatar.onclick = function (evt) {
          evt.preventDefault();
          var fileInput = document.createElement("input");
          fileInput.type = "file";
          fileInput.accept = ".png,.jpg,.jpeg,.webp,.gif";

          fileInput.addEventListener("change", function () {
            var file = fileInput.files[0];
            var reader = new FileReader();
            reader.addEventListener("load", function (e) {
              var result = e.target.result;
              compressImage(result, 100, 100, function (image) {
                OrchidServices.set("profile/" + userId, {
                  profile_picture: image,
                });
              });
            });
            reader.readAsDataURL(file);
          });
          fileInput.click();
        };

        username.onclick = () => {
          username.contentEditable = true;
          username.onblur = () => {
            OrchidServices.set("profile/" + userId, {
              username: username.textContent,
            });
            username.contentEditable = false;
            username.onblur = null;
          };
          username.focus();
          username.onkeydown = (evt) => {
            switch (evt.keyCode) {
              case 13:
                OrchidServices.set("profile/" + userId, {
                  username: username.textContent,
                });
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

        OrchidServices.get('profile/' + OrchidServices.userId()).then(data => {
          if (data.friends.indexOf(userId) !== -1) {
            addFriendButton.dataset.l10nId = 'remove-friend';
          }
        });

        addFriendButton.onclick = function (evt) {
          OrchidServices.get('profile/' + OrchidServices.userId()).then((data) => {
            var friends = data.friends || [];

            if (friends.indexOf(userId) !== -1) {
              friends.push(userId);
              OrchidServices.set('profile/' + OrchidServices.userId(), { friends: friends });
              addFriendButton.dataset.l10nId = 'remove-friend';
            } else {
              friends.splice(userId);
              OrchidServices.set('profile/' + OrchidServices.userId(), { friends: friends });
              addFriendButton.dataset.l10nId = 'add-friend';
            }
          });
        };

        followButton.onclick = function (evt) {
          OrchidServices.get('profile/' + OrchidServices.userId()).then((data) => {
            var followers = data.followers || [];

            if (followers.indexOf(userId) !== -1) {
              followers.push(userId);
              OrchidServices.set('profile/' + OrchidServices.userId(), { followers: followers });
              followButton.dataset.l10nId = 'unfollow';
            } else {
              followers.splice(userId);
              OrchidServices.set('profile/' + OrchidServices.userId(), { followers: followers });
              followButton.dataset.l10nId = 'follow';
            }
          });
        };
      }

      badges.innerHTML = "";
      drawMetaBadge("verified", data.is_verified);
      drawMetaBadge("moderator", data.is_moderator);
      drawMetaBadge("supporter", data.is_supporter);
      drawMetaBadge("developer", data.is_developer);

      if (data.token == OrchidServices.userId()) {
        phoneNumber.parentElement.addEventListener('click', () => {
          InputDialog('phone-number-dialog', data.phone_number, (data) => {
            console.log(data);
            OrchidServices.set('profile/' + OrchidServices.userId(), { phone_number: data });
          });
        });
        description.parentElement.addEventListener('click', () => {
          InputDialog('description-dialog', data.description, (data) => {
            console.log(data);
            OrchidServices.set('profile/' + OrchidServices.userId(), { description: data });
          });
        });

        phoneNumberHolder.classList.add('active');
        descriptionHolder.classList.add('active');
      } else {
        phoneNumberHolder.classList.remove('active');
        descriptionHolder.classList.remove('active');
      }
    });

    var webapps = document.getElementById("webapps");
    var posts = document.getElementById("posts");

    webapps.innerHTML = '';
    posts.innerHTML = '';

    OrchidServices.getList("webstore", function (data, id) {
      if (data.author_id == userId) {
        createWebappIcon(data, id, false);
      }
    });
    OrchidServices.getList("articles", function (data, id) {
      if (data.author_id == userId) {
        createPostCard(data, id);
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
