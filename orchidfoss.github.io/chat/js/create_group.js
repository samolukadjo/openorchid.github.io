"use strict";

function createGroup() {
  var isAvatarSet = false;
  var dialog = document.getElementById("create-dialog");
  var avatar = dialog.querySelector(".image-container");
  var avatarImage = dialog.querySelector(".image-container img");
  var name = document.getElementById("create-dialog-name");
  var closeButton = document.getElementById("create-dialog-close");
  var createButton = document.getElementById("create-dialog-create");

  dialog.classList.add("visible");

  avatar.onclick = () => {
    var fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = ".png,.jpg,.jpeg,.webp,.gif";

    fileInput.addEventListener("change", function () {
      var file = fileInput.files[0];
      var reader = new FileReader();
      reader.addEventListener("load", function (e) {
        var result = e.target.result;
        resizeImage(result, function (image) {
          avatarImage.src = image;
          isAvatarSet = true;
        });
      });
      reader.readAsDataURL(file);
    });
    fileInput.click();
  };

  avatarImage.src =
      "https://ui-avatars.com/api/?name=My%20Server&background=random";
  avatarImage.onerror = () => {
    avatarImage.src =
      "https://ui-avatars.com/api/?name=" +
      (name.value || "My Server") +
      "&background=random";
  };

  name.addEventListener('change', () => {
    if (!isAvatarSet) {
      avatarImage.src =
      "https://ui-avatars.com/api/?name=" +
      (name.value || "My Server") +
      "&background=random";
    }
  });

  closeButton.onclick = function () {
    dialog.classList.remove("visible");
  };

  createButton.onclick = function () {
    dialog.classList.remove("visible");
    OrchidServices.custom.createChatGroup(name.value, avatarImage.src);
  };
}
