(function (exports) {
  'use strict';

  var data;
  var currentApp;
  var webapps = document.getElementById('webapps');

  OrchidServices.getList('webstore', function (data, id) {
    createIcon(data, id, false);
  });

  var client = new XMLHttpRequest();
  client.open('GET', 'https://banana-hackers.gitlab.io/store-db/data.json');
  client.onreadystatechange = () => {
    data = JSON.parse(client.responseText);
    console.log(data);
    data.apps.forEach((app) => {
      createIcon(app, app.slug, true);
      if (currentApp !== null) {
        if (currentApp == app.slug) {
          openInfo(app, app.slug, true);
        }
      }
    });
  };
  client.send();

  function createIcon(data, id, isBananaHackers) {
    var element = document.createElement('a');
    element.href = '?webapp=' + id;
    element.classList.add('webapp');
    element.title = data.name;
    element.onclick = (evt) => {
      evt.preventDefault();
      openInfo(data, id, isBananaHackers);
    }
    webapps.appendChild(element);

    var iconHolder = document.createElement('div');
    iconHolder.classList.add('icon-holder');
    element.appendChild(iconHolder);

    var icon = document.createElement('img');
    icon.src = data.icon;
    iconHolder.appendChild(icon);

    var context = document.createElement('div');
    context.classList.add('context');
    element.appendChild(context);

    var title = document.createElement('span');
    title.classList.add('title');
    title.textContent = data.name;
    context.appendChild(title);

    var author = document.createElement('a');
    author.classList.add('author');
    context.appendChild(author);

    if (isBananaHackers) {
      author.textContent = data.author;
    } else {
      OrchidServices.getWithUpdate('profile/' + data.author_id, function (udata) {
        author.textContent = udata.username;
        author.href = '/account/?user=' + udata.username;
      });
    }

    var categories = document.createElement('div');
    categories.classList.add('categories');

    if (isBananaHackers) {
      data.meta.categories.forEach(item => {
        var category = document.createElement('span');
        category.dataset.l10nId = 'category-' + item;
        categories.appendChild(category);
      });
    } else {
      data.categories.forEach(item => {
        var category = document.createElement('span');
        category.dataset.l10nId = 'category-' + item;
        categories.appendChild(category);
      });
    }

    context.appendChild(categories);
  }


  function openInfo(data, id, isBananaHackers) {
    var sidebar = document.getElementById('sidebar');
    var toggleSidebarButton = document.getElementById('toggle-sidebar-button');
    var backButton = document.getElementById('back-button');
    var content = document.getElementById('content');
    var webapp = document.getElementById('webapp');
    var webappCard = document.getElementById('webapp-card');
    var webappBanner = document.getElementById('webapp-banner');
    var webappIcon = document.getElementById('webapp-icon');
    var webappName = document.getElementById('webapp-name');
    var webappAuthor = document.getElementById('webapp-author');
    var webappStarRatings = document.getElementById('webapp-star-ratings');
    var webappAverageRating = document.getElementById('webapp-average-rating');
    var webappCategories = document.getElementById('webapp-categories');
    var installButton = document.getElementById('webapp-install-button');
    var uninstallButton = document.getElementById('webapp-uninstall-button');
    var updateButton = document.getElementById('webapp-update-button');
    var webappScreenshots = document.getElementById('webapp-screenshots');
    var webappScreenshotsHolder = document.getElementById('webapp-screenshots-holder');
    var webappDescription = document.getElementById('webapp-description');
    var webappInstallSize = document.getElementById('webapp-install-size');
    var webappSupportedDevices = document.getElementById('webapp-supported-devices');

    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    })
    if (!isBananaHackers || data.teaser_url) {
      webappBanner.src = data.teaser_url.replace('watch?v=', 'embed/') + '?controls=0&autoplay=1&loop=1&ref=0&fs=0&modestbranding=0';
    }

    webappCard.classList.add('fade-in');
    webappCard.addEventListener('animationend', () => {
      webappCard.classList.remove('fade-in');
    });

    webapp.classList.add('visible');
    sidebar.style.display = 'none';
    toggleSidebarButton.style.display = 'none';
    backButton.style.display = 'block';
    content.style.display = 'none';
    window.history.pushState({"html":'',"pageTitle":''}, "", '?webapp=' + id);

    backButton.onclick = () => {
      if (!isBananaHackers) {
        webappBanner.src = '';
      }
      webappCard.classList.add('fade-out');

      // This helps us avoid the page closing next time we open it again.
      setTimeout(() => {
        webappCard.classList.remove('fade-out');
        webapp.classList.remove('visible');
        sidebar.style.display = 'block';
        toggleSidebarButton.style.display = 'block';
        backButton.style.display = 'none';
        content.style.display = 'block';
        window.history.pushState({"html": '', "pageTitle": ''}, "", '/webstore/');
      }, 300);
    };

    webappIcon.src = data.icon;
    webappName.textContent = data.name;

    if (isBananaHackers) {
      webappAuthor.textContent = data.author;
      webappAuthor.href = null;
    } else {
      OrchidServices.getWithUpdate('profile/' + data.author_id, function (udata) {
        webappAuthor.textContent = udata.username;
        webappAuthor.href = '/account/?user=' + udata.username;
      });
    }

    if (isBananaHackers || data.comments.length == 0) {
      webappAverageRating.textContent = '';
      webappStarRatings.innerHTML = '';
    } else {
      var sum = 0;
      for (var i = 0; i < data.comments.length; i++) {
        sum += parseInt((data.comments[i].rating * 5), 10); //don't forget to add the base
      }
      var avg = sum / data.comments.length;

      webappAverageRating.textContent = Math.round(avg * 10) / 10;

      webappStarRatings.innerHTML = '';
      for (let index = 0; index < parseInt(avg); index++) {
        var star = document.createElement('span');
        star.classList.add('star');
        star.dataset.icon = 'bookmarked';
        webappStarRatings.appendChild(star);
      }
      for (let index = 0; index < (5 - parseInt(avg)); index++) {
        var star = document.createElement('span');
        star.classList.add('star');
        star.dataset.icon = 'bookmark';
        webappStarRatings.appendChild(star);
      }
    }

    webappCategories.innerHTML = '';
    if (isBananaHackers) {
      data.meta.categories.forEach(item => {
        var category = document.createElement('span');
        category.dataset.l10nId = 'category-' + item;
        webappCategories.appendChild(category);
      });
    } else {
      if (data.categories.length == 0) {
        data.categories.forEach(item => {
          var category = document.createElement('span');
          category.dataset.l10nId = 'category-' + item;
          webappCategories.appendChild(category);
        });
      }
    }

    installButton.onclick = () => {
      if (navigator.mozApps) {
        navigator.mozApps.mgmt.installPackage(data.download.url);
      } else {
        if (isBananaHackers) {
          location.href = data.download.url;
        } else {
          var a = document.createElement('a');
          a.href = data.download;
          a.download = 'webapp.orchidpkg.zip';
          a.click();
        }
      }
    };

    uninstallButton.onclick = () => {};
    updateButton.onclick = () => {};

    webappScreenshots.innerHTML = '';
    if (data.screenshots.length !== 0) {
      data.screenshots.forEach(item => {
        var screenshot = document.createElement('img');
        screenshot.src = item;
        webappScreenshots.appendChild(screenshot);
      });
      webappScreenshotsHolder.style.display = 'block';
    } else {
      webappScreenshotsHolder.style.display = 'none';
    }

    webappDescription.textContent = data.description;
  }

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== '') {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case 'webapp':
          OrchidServices.get('webapps/' + pair[1]).then(function(data) {
            openInfo(data, pair[1], false);
          });
          currentApp = pair[1];
          break;

        default:
          break;
      }
    }
  }
})(window);