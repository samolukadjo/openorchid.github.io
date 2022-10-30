"use strict";

export function profile(id) {
  var dialog = document.getElementById("profile");
  var avatar = document.getElementById("profile-avatar");
  var username = document.getElementById("profile-username");
  var badges = document.getElementById("profile-badges");
  var addFriendButton = document.getElementById("profile-addfriend");
  var messageButton = document.getElementById("profile-message");
  var description = document.getElementById("profile-description");
  var closeButton = document.getElementById("profile-close");

  dialog.classList.add("visible");
  OrchidServices.get("profile/" + id).then(function (data) {
    avatar.src = data.profile_picture;
    username.innerText = data.username;
    description.innerHTML = data.description;
    if (data.is_verified) {
      var badge = document.createElement("div");
      badge.classList.add("verified");
      badges.appendChild(badge);
    }
    if (data.is_moderator) {
      var badge = document.createElement("div");
      badge.classList.add("moderator");
      badges.appendChild(badge);
    }
    if (data.is_developer) {
      var badge = document.createElement("div");
      badge.classList.add("developer");
      badges.appendChild(badge);
    }
    if (data.is_supporter) {
      var badge = document.createElement("div");
      badge.classList.add("supporter");
      badges.appendChild(badge);
    }
  });

  addFriendButton.onclick = function () {
    var uuid = OrchidServices._generateUUID();
    OrchidServices.set(
      "profile/" + OrchidServices.userId() + "/friends/" + id,
      uuid
    );
    OrchidServices.set(
      "profile/" + id + "/friends/" + OrchidServices.userId(),
      uuid
    );
  };
  OrchidServices.getWithUpdate(
    "profile/" + OrchidServices.userId() + "/friends/" + id,
    function (data) {
      if (id == OrchidServices.userId() || data) {
        addFriendButton.style.display = "none";
      } else {
        addFriendButton.style.display = "block";
      }
    }
  );

  messageButton.onclick = function () {
    // ...
  };
  OrchidServices.getWithUpdate(
    "profile/" + OrchidServices.userId() + "/friends/" + id,
    function (data) {
      if (id == OrchidServices.userId() || !data) {
        messageButton.style.display = "none";
      } else {
        messageButton.style.display = "block";
      }
    }
  );

  closeButton.onclick = function () {
    dialog.classList.remove("visible");
  };
}
