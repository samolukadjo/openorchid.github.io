(function (exports) {
  "use strict";

  var categoryIcons = {
    'communication': 'sms',
    'education': 'help',
    'games': 'play',
    'health': 'heart',
    'multimedia': 'video',
    'news': 'tab-previews',
    'search': 'search',
    'social': 'user',
    'travel': 'airplane',
    'utility': 'permissions'
  };

  var isListEnabled = false;
  var addons = document.getElementById("addons");
  var categories = document.getElementById("categories");
  var allAppsButton = document.getElementById('sidebar-allapps');

  allAppsButton.onclick = () => {
    var selected = document.querySelector('[aria-selected="true"]');
    selected.setAttribute('aria-selected', null);
    allAppsButton.setAttribute('aria-selected', true);
  };

  OrchidServices.getList("webstore", function (data, id) {
    createIcon(app, id, false);
  });

  function setCategory(id, app) {
    if (document.querySelector('[data-category="' + id + '"]')) {
      var container = document.querySelector(
        '[data-category="' + id + '"] > .addons'
      );
      container.appendChild(app);
    } else {
      var listItem = document.createElement("li");
      categories.appendChild(listItem);

      var link = document.createElement("a");
      link.href = '#category-' + id;
      link.dataset.l10nId = "category-" + id;
      link.dataset.icon = categoryIcons[id];
      link.onclick = () => {
        var selected = document.querySelector('[aria-selected="true"]');
        selected.setAttribute('aria-selected', null);
        link.setAttribute('aria-selected', true);
      };
      listItem.appendChild(link);

      var element = document.createElement("div");
      element.id = 'category-' + id;
      element.dataset.category = id;
      element.classList.add("addons-group");
      addons.appendChild(element);

      document.addEventListener('wheel', () => {
        if (element.getBoundingClientRect().top <= (window.innerHeight - (element.getBoundingClientRect().height - 1))) {
          var selected = document.querySelector('[aria-selected="true"]');
          selected.setAttribute('aria-selected', null);
          link.setAttribute('aria-selected', true);
        }
      });
      document.addEventListener('touchmove', () => {
        if (element.getBoundingClientRect().top <= (window.innerHeight - (element.getBoundingClientRect().height - 1))) {
          var selected = document.querySelector('[aria-selected="true"]');
          selected.setAttribute('aria-selected', null);
          link.setAttribute('aria-selected', true);
        }
      });

      var header = document.createElement("header");
      element.appendChild(header);

      var title = document.createElement("h1");
      title.dataset.l10nId = "category-" + id;
      header.appendChild(title);

      var expandButton = document.createElement("a");
      expandButton.href = "#";
      expandButton.dataset.icon = "expand-chevron";
      expandButton.dataset.l10nId = "show-more";
      expandButton.onclick = (evt) => {
        evt.preventDefault();
        element.classList.toggle("expanded");
        if (element.classList.contains("expanded")) {
          expandButton.dataset.icon = "collapse-chevron";
          expandButton.dataset.l10nId = "show-less";
        } else {
          expandButton.dataset.icon = "expand-chevron";
          expandButton.dataset.l10nId = "show-more";
        }
      };
      header.appendChild(expandButton);

      var container = document.createElement("div");
      container.classList.add("addons");
      if (isListEnabled) {
        container.classList.add("list");
      }
      element.appendChild(container);

      container.appendChild(app);

      isListEnabled = !isListEnabled;
    }
  }

  function createIcon(data, id, isBananaHackers) {
    var element = document.createElement("a");
    element.href = "?addon=" + id;
    element.classList.add("addon");
    element.title = data.name;
    element.onclick = (evt) => {
      evt.preventDefault();
      openInfo(data, id, isBananaHackers);
    };

    if (isBananaHackers) {
      setCategory(data.meta.categories[0], element);
    } else {
      setCategory(data.categories[0], element);
    }

    var iconHolder = document.createElement("div");
    iconHolder.classList.add("icon-holder");
    element.appendChild(iconHolder);

    var icon = document.createElement("img");
    icon.src = data.icon;
    icon.onerror = () => {
      icon.src = "images/default.svg";
    };
    iconHolder.appendChild(icon);

    var context = document.createElement("div");
    context.classList.add("context");
    element.appendChild(context);

    var title = document.createElement("span");
    title.classList.add("title");
    title.textContent = data.name;
    context.appendChild(title);

    var author = document.createElement("a");
    author.classList.add("author");
    context.appendChild(author);

    if (isBananaHackers) {
      author.textContent = data.author;
    } else {
      OrchidServices.getWithUpdate(
        "profile/" + data.author_id,
        function (udata) {
          author.textContent = udata.username;
          author.href = "/account/?user=" + udata.username;
        }
      );
    }

    var categories = document.createElement("div");
    categories.classList.add("categories");

    if (isBananaHackers) {
      data.meta.categories.forEach((item) => {
        var category = document.createElement("span");
        category.dataset.l10nId = "category-" + item;
        categories.appendChild(category);
      });
    } else {
      data.categories.forEach((item) => {
        var category = document.createElement("span");
        category.dataset.l10nId = "category-" + item;
        categories.appendChild(category);
      });
    }

    context.appendChild(categories);
  }

  function openInfo(addonData, id, isBananaHackers) {
    var sidebar = document.getElementById("sidebar");
    var toggleSidebarButton = document.getElementById("toggle-sidebar-button");
    var backButton = document.getElementById("back-button");
    var content = document.getElementById("content");
    var addon = document.getElementById("addon");
    var addonCard = document.getElementById("addon-card");
    var addonBanner = document.getElementById("addon-banner");
    var addonIcon = document.getElementById("addon-icon");
    var addonName = document.getElementById("addon-name");
    var addonAuthor = document.getElementById("addon-author");
    var addonStarRatings = document.getElementById("addon-star-ratings");
    var addonAverageRating = document.getElementById("addon-average-rating");
    var addonCategories = document.getElementById("addon-categories");
    var installButton = document.getElementById("addon-install-button");
    var uninstallButton = document.getElementById("addon-uninstall-button");
    var updateButton = document.getElementById("addon-update-button");
    var addonScreenshots = document.getElementById("addon-screenshots");
    var addonScreenshotsHolder = document.getElementById(
      "addon-screenshots-holder"
    );
    var addonDescription = document.getElementById("addon-description");
    var addonInstallSize = document.getElementById("addon-install-size");
    var addonSupportedDevices = document.getElementById(
      "addon-supported-devices"
    );
    var addonTags = document.getElementById("addon-tags");
    var addonComments = document.getElementById("addon-comments");
    var addonCommentsHeader = document.getElementById(
      "addon-comments-header"
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    if (!isBananaHackers && addonData.teaser_url) {
      addonBanner.src =
        addonData.teaser_url.replace("watch?v=", "embed/") +
        "?controls=0&autoplay=1&loop=1&ref=0&fs=0&modestbranding=0";
    }

    addonCard.classList.add("fade-in");
    addonCard.addEventListener("animationend", () => {
      addonCard.classList.remove("fade-in");
    });

    addon.classList.add("visible");
    sidebar.style.display = "none";
    toggleSidebarButton.style.display = "none";
    backButton.style.display = "block";
    content.style.display = "none";
    window.history.pushState({ html: "", pageTitle: "" }, "", "?addon=" + id);

    backButton.onclick = () => {
      if (!isBananaHackers) {
        addonBanner.src = "";
      }
      addonCard.classList.add("fade-out");

      // This helps us avoid the page closing next time we open it again.
      setTimeout(() => {
        addonCard.classList.remove("fade-out");
        addon.classList.remove("visible");
        sidebar.style.display = "block";
        toggleSidebarButton.style.display = "block";
        backButton.style.display = "none";
        content.style.display = "block";
        window.history.pushState({ html: "", pageTitle: "" }, "", "/webstore/");
      }, 300);
    };

    addonIcon.src = addonData.icon;
    addonIcon.onerror = () => {
      addonIcon.src = "images/default.svg";
    };

    addonName.textContent = addonData.name;

    if (isBananaHackers) {
      addonAuthor.textContent = addonData.author;
      addonAuthor.href = null;
    } else {
      OrchidServices.getWithUpdate(
        "profile/" + addonData.author_id,
        function (udata) {
          addonAuthor.textContent = udata.username;
          addonAuthor.href = "/account/?user=" + udata.username;
        }
      );
    }

    function initializeRating(commentsArray) {
      if (commentsArray.length == 0) {
        addonAverageRating.textContent = "";
        addonStarRatings.innerHTML = "";
      } else {
        var sum = 0;
        for (var i = 0; i < commentsArray.length; i++) {
          sum += parseInt(commentsArray[i].rating * 5, 10); //don't forget to add the base
        }
        var avg = sum / commentsArray.length;

        addonAverageRating.textContent = Math.round(avg * 10) / 10;
        if (isBananaHackers) {
          OrchidServices.set("webstore_legacy/" + id, {
            rating_average: Math.round(avg * 10) / 10,
          });
        } else {
          OrchidServices.set("webstore/" + id, {
            rating_average: Math.round(avg * 10) / 10,
          });
        }

        addonStarRatings.innerHTML = "";
        for (let index = 0; index < parseInt(avg); index++) {
          var star = document.createElement("span");
          star.classList.add("star");
          star.dataset.icon = "bookmarked";
          addonStarRatings.appendChild(star);
        }
        for (let index = 0; index < 5 - parseInt(avg); index++) {
          var star = document.createElement("span");
          star.classList.add("star");
          star.dataset.icon = "bookmark";
          addonStarRatings.appendChild(star);
        }
      }
    }

    if (addonData.comments) {
      initializeRating(addonData.comments);
    } else {
      OrchidServices.get("webstore_legacy/" + id).then((data) => {
        if (data) {
          initializeRating(data.comments);
        } else {
          addonStarRatings.innerHTML = "";
          addonAverageRating.innerHTML = "";
        }
      });
    }

    addonCategories.innerHTML = "";
    if (isBananaHackers) {
      addonData.meta.categories.forEach((item) => {
        var category = document.createElement("span");
        category.dataset.l10nId = "category-" + item;
        addonCategories.appendChild(category);
      });
    } else {
      if (addonData.categories.length == 0) {
        addonData.categories.forEach((item) => {
          var category = document.createElement("span");
          category.dataset.l10nId = "category-" + item;
          addonCategories.appendChild(category);
        });
      }
    }

    installButton.onclick = () => {
      if (navigator.mozApps) {
        navigator.mozApps.mgmt.installPackage(addonData.download.url);
      } else {
        if (isBananaHackers) {
          location.href = addonData.download.url;
        } else {
          var a = document.createElement("a");
          a.href = addonData.download;
          a.download = "addon.orchidpkg.zip";
          a.click();
        }
      }
    };

    uninstallButton.onclick = () => {};
    updateButton.onclick = () => {};

    addonScreenshots.innerHTML = "";
    if (addonData.screenshots) {
      if (addonData.screenshots.length !== 0) {
        addonData.screenshots.forEach((item) => {
          var screenshot = document.createElement("img");
          screenshot.src = item;
          addonScreenshots.appendChild(screenshot);
        });
        addonScreenshotsHolder.style.display = "block";
      } else {
        addonScreenshotsHolder.style.display = "none";
      }
    }

    addonDescription.textContent = addonData.description;

    if (!isBananaHackers) {
      addonTags.textContent = addonData.tags.join(", ");
    } else {
      addonTags.textContent = addonData.meta.tags
        .split(";")
        .filter(String)
        .join(", ");
    }

    if (!isBananaHackers) {
      Comments("webstore/" + id, addonComments, true);
      OrchidServices.getWithUpdate("webstore/" + id, (data) => {
        addonCommentsHeader.dataset.l10nArgs =
          '{"n":"' + data.comments.length + '"}';
      });
    } else {
      OrchidServices.getWithUpdate("webstore_legacy/" + id, (data) => {
        if (data) {
          addonCommentsHeader.dataset.l10nArgs =
            '{"n":"' + data.comments.length + '"}';
          Comments("webstore_legacy/" + id, addonComments, true);
        } else {
          OrchidServices.set("webstore_legacy/" + id, { comments: [] });
        }
      });
    }
  }

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== "") {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case "addon":
          setTimeout(() => {
            OrchidServices.get("addons/" + pair[1]).then(function (data) {
              if (data) {
                openInfo(data, pair[1], false);
              }
            });
          }, 1000);
          break;

        default:
          break;
      }
    }
  }
})(window);
