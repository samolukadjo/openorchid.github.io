(function (exports) {
  "use strict";

  var LIKE_SOUND = new Audio("resources/sounds/like.wav");
  var DISLIKE_SOUND = new Audio("resources/sounds/dislike.wav");

  var posts = document.getElementById("posts");

  exports.createPostCard = function createPostCard(data, id) {
    var element = document.createElement("a");
    element.href = "?post=" + id;
    element.classList.add("post");
    element.classList.add("post-object");
    element.onclick = (evt) => {
      evt.preventDefault();
      OrchidServices.get("articles/" + id).then((data) => {
        showPostInfo(id);
      });
    };
    posts.appendChild(element);

    var iconHolder = document.createElement("div");
    iconHolder.classList.add("icon-holder");
    element.appendChild(iconHolder);

    var icon = document.createElement("img");
    icon.src = data.icon;
    icon.loading = "lazy";
    icon.onerror = () => {
      icon.src =
        "https://orchidfoss.github.io/images/profile_pictures/avatar_default.svg";
    };
    iconHolder.appendChild(icon);

    var contentHolder = document.createElement("div");
    contentHolder.classList.add("content-holder");
    element.appendChild(contentHolder);

    var author = document.createElement("a");
    author.classList.add("author");
    author.target = "_blank";
    contentHolder.appendChild(author);

    var content = document.createElement("span");
    content.classList.add("context");
    content.textContent = data.content;
    contentHolder.appendChild(content);

    var images = document.createElement("div");
    images.classList.add("images");
    contentHolder.appendChild(images);

    if (data.images) {
      data.images.forEach((image) => {
        var element = document.createElement("img");
        element.src = image;
        element.loading = "lazy";
        images.appendChild(element);
      });
    }

    OrchidServices.getWithUpdate("profile/" + data.author_id, (udata) => {
      if (udata) {
        icon.src = udata.profile_picture;
        author.innerHTML = `<span>${udata.username}</span>`;
        author.href = "/profile/?user_id=" + udata.token;

        if (udata.metadata || udata.metadata.is_verified) {
          author.classList.add("verified");
        }
      }
    });

    var nav = document.createElement("nav");
    element.appendChild(nav);

    var likeButton = document.createElement("button");
    likeButton.classList.add("like-button");
    likeButton.dataset.icon = "like";
    nav.appendChild(likeButton);

    var likeButtonNumber = document.createElement("span");
    likeButtonNumber.textContent = EnglishToArabicNumerals(data.likes.length);
    likeButton.appendChild(likeButtonNumber);

    var likeButtonTooltip = document.createElement("div");
    likeButtonTooltip.setAttribute("role", "title");
    likeButtonTooltip.classList.add("bottom");
    likeButtonTooltip.dataset.l10nId = "post-like";
    likeButton.appendChild(likeButtonTooltip);

    var dislikeButton = document.createElement("button");
    dislikeButton.classList.add("dislike-button");
    dislikeButton.dataset.icon = "dislike";
    nav.appendChild(dislikeButton);

    var dislikeButtonNumber = document.createElement("span");
    dislikeButtonNumber.textContent = EnglishToArabicNumerals(
      data.dislikes.length
    );
    dislikeButton.appendChild(dislikeButtonNumber);

    var dislikeButtonTooltip = document.createElement("div");
    dislikeButtonTooltip.setAttribute("role", "title");
    dislikeButtonTooltip.classList.add("bottom");
    dislikeButtonTooltip.dataset.l10nId = "post-dislike";
    dislikeButton.appendChild(dislikeButtonTooltip);

    if (data.likes.indexOf(OrchidServices.userId()) !== -1) {
      likeButton.classList.add("enabled");
    }
    if (data.dislikes.indexOf(OrchidServices.userId()) !== -1) {
      dislikeButton.classList.add("enabled");
    }

    if (!OrchidServices.isUserLoggedIn()) {
      likeButton.setAttribute("disabled", true);
      dislikeButton.setAttribute("disabled", true);
    }

    likeButton.addEventListener("click", function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      OrchidServices.get("articles/" + data.token).then((data) => {
        if (data.likes.indexOf(OrchidServices.userId()) === -1) {
          data.likes.push(OrchidServices.userId());
          LIKE_SOUND.currentTime = 0;
          LIKE_SOUND.play();
        } else {
          data.likes.splice(OrchidServices.userId());
        }

        data.dislikes.splice(OrchidServices.userId());
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(
          data.dislikes.length
        );
        dislikeButton.classList.remove("enabled");
        OrchidServices.set("articles/" + data.token, { likes: data.likes });
        OrchidServices.set("articles/" + data.token, {
          dislikes: data.dislikes,
        });
        likeButtonNumber.textContent = EnglishToArabicNumerals(
          data.likes.length
        );
        likeButton.classList.toggle("enabled");
      });
    });

    dislikeButton.addEventListener("click", function (evt) {
      evt.preventDefault();
      evt.stopPropagation();
      OrchidServices.get("articles/" + data.token).then((data) => {
        if (data.dislikes.indexOf(OrchidServices.userId()) === -1) {
          data.dislikes.push(OrchidServices.userId());
          DISLIKE_SOUND.currentTime = 0;
          DISLIKE_SOUND.play();
        } else {
          data.dislikes.splice(OrchidServices.userId());
        }

        data.likes.splice(OrchidServices.userId());
        likeButtonNumber.textContent = EnglishToArabicNumerals(
          data.likes.length
        );
        likeButton.classList.remove("enabled");
        OrchidServices.set("articles/" + data.token, { likes: data.likes });
        OrchidServices.set("articles/" + data.token, {
          dislikes: data.dislikes,
        });
        dislikeButtonNumber.textContent = EnglishToArabicNumerals(
          data.dislikes.length
        );
        dislikeButton.classList.toggle("enabled");
      });
    });

    var shareButton = document.createElement("button");
    shareButton.classList.add("share-button");
    shareButton.dataset.icon = "share";
    nav.appendChild(shareButton);

    var shareButtonTooltip = document.createElement("div");
    shareButtonTooltip.setAttribute("role", "title");
    shareButtonTooltip.classList.add("bottom");
    shareButtonTooltip.dataset.l10nId = "post-share";
    shareButton.appendChild(shareButtonTooltip);

    var optionsButton = document.createElement("button");
    optionsButton.classList.add("options-button");
    optionsButton.dataset.icon = "options";
    nav.appendChild(optionsButton);

    var optionsButtonTooltip = document.createElement("div");
    optionsButtonTooltip.setAttribute("role", "title");
    optionsButtonTooltip.classList.add("bottom");
    optionsButtonTooltip.dataset.l10nId = "post-options";
    optionsButton.appendChild(optionsButtonTooltip);
  };

  exports.showPostInfo = function showPostInfo(id) {
    location.href = 'https://orchidfoss.github.io/articles/?post=' + id;
  };
})(window);
