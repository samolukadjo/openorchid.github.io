(function (exports) {
  "use strict";
  var isListEnabled = false;
  var webapps = document.getElementById("webapps");

  exports.setWebappCategory = function setWebappCategory(id, app) {
    if (document.querySelector('[data-category="' + id + '"]')) {
      var container = document.querySelector(
        '[data-category="' + id + '"] > .webapps'
      );
      container.appendChild(app);
    } else {
      var element = document.createElement("div");
      element.id = "category-" + id;
      element.dataset.category = id;
      element.classList.add("webapps-group");
      webapps.appendChild(element);

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
          expandButton.dataset.l10nId = "show-less";
        } else {
          expandButton.dataset.l10nId = "show-more";
        }
        expandButton.classList.toggle("active");
      };
      header.appendChild(expandButton);

      var container = document.createElement("div");
      container.classList.add("webapps");
      if (isListEnabled) {
        container.classList.add("list");
      }
      element.appendChild(container);

      container.appendChild(app);

      isListEnabled = !isListEnabled;
    }
  };

  exports.createWebappIcon = function createWebappIcon(data, id) {
    var element = document.createElement("a");
    element.href = "?webapp=" + id;
    element.classList.add("webapp");
    element.onclick = (evt) => {
      evt.preventDefault();
      showWebappInfo(id);
    };
    setWebappCategory(data.categories[0], element);

    OrchidServices.get("profile/" + OrchidServices.userId()).then((data) => {
      if (data.metadata.is_moderator) {
        var modRemove = document.createElement("button");
        modRemove.classList.add("mod-remove");
        modRemove.dataset.icon = "closecancel";
        modRemove.onclick = (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          var confirmPrompt = confirm(navigator.mozL10n.get('mod-removeApp'));
          if (confirmPrompt) {
            OrchidServices.remove("webstore/" + id);
            element.remove();
          }
        };
        element.appendChild(modRemove);
      }
    });

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
    context.appendChild(title);

    var titleSpan = document.createElement("span");
    titleSpan.textContent = data.name;
    title.appendChild(titleSpan);

    if (titleSpan.offsetWidth >= title.offsetWidth) {
      title.classList.add("marquee");
      titleSpan.style.animationDuration =
        titleSpan.textContent.length * 200 + "ms";
    }

    var author = document.createElement("a");
    author.classList.add("author");
    author.target = '_blank';
    context.appendChild(author);

    OrchidServices.getWithUpdate("profile/" + data.author_id, function (udata) {
      author.innerHTML = `<span>${udata.username}</span>`;
      author.href = "/profile/?user_id=" + udata.token;
    });

    var categories = document.createElement("div");
    categories.classList.add("categories");
    data.categories.forEach((item) => {
      var category = document.createElement("span");
      category.dataset.l10nId = "category-" + item;
      categories.appendChild(category);
    });
    context.appendChild(categories);

    var pricing = document.createElement("span");
    pricing.classList.add("pricing");
    if (data.price == 0) {
      pricing.dataset.l10nId = "pricing-free";
      pricing.dataset.l10nArgs = "";
    } else {
      pricing.dataset.l10nId = "pricing-paid";
      pricing.dataset.l10nArgs = '{"n": "' + data.price + '"}';
    }
    context.appendChild(pricing);

    var rating = document.createElement("span");
    rating.classList.add("rating");
    rating.dataset.icon = "bookmarked";

    var sum = 0;
    for (var i = 0; i < data.comments.length; i++) {
      sum += parseInt(data.comments[i].rating * 5, 10); //don't forget to add the base
    }
    var avg = sum / data.comments.length;

    rating.dataset.l10nId = "starRating-outOf";
    rating.dataset.l10nArgs =
      '{"n": "' + (Math.round(avg * 10) / 10).toFixed(1) + '"}';
    context.appendChild(rating);

    var nav = document.createElement("nav");
    element.appendChild(nav);

    var installButton = document.createElement("button");
    installButton.classList.add("install-button");
    installButton.dataset.l10nId = "webapp-install";
    nav.appendChild(installButton);
  };

  exports.showWebappInfo = function showWebappInfo(id) {
    location.href = 'https://orchidfoss.github.io/webstore/?webapp=' + id;
  };
})(window);
