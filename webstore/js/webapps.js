(function (exports) {
  'use strict';

  var webapps = document.getElementById('webapps');

  OrchidServices.getList('webapps', function (data, id) {
    createIcon(data, id);
  });

  function createIcon(data, id) {
    var element = document.createElement('a');
    element.href = '?webapp=' + id;
    element.classList.add('webapp');
    element.title = data.name;
    element.onclick = (evt) => {
      evt.preventDefault();
      openInfo(data, id, element);
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
    author.href = '#';
    author.classList.add('author');
    context.appendChild(author);
    OrchidServices.getWithUpdate('profile/' + data.author_id, function (udata) {
      author.textContent = udata.username;
      author.href = '/account/?user=' + udata.username;
    });

    var categories = document.createElement('div');
    categories.classList.add('categories');
    data.categories.forEach(item => {
      var category = document.createElement('span');
      category.textContent = item;
      categories.appendChild(category);
    });
    context.appendChild(categories);
  }


  function openInfo(data, id) {
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
    var webappDescription = document.getElementById('webapp-description');
    var webappPatchNotes = document.getElementById('webapp-patch-notes');
    var webappInstallSize = document.getElementById('webapp-install-size');
    var webappSupportedDevices = document.getElementById('webapp-supported-devices');

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
    OrchidServices.getWithUpdate('profile/' + data.author_id, function (udata) {
      webappAuthor.textContent = udata.username;
      webappAuthor.href = '/account/?user=' + udata.username;
    });

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

    webappCategories.innerHTML = '';
    data.categories.forEach(item => {
      var category = document.createElement('span');
      category.textContent = item;
      webappCategories.appendChild(category);
    });

    installButton.onclick = () => {
      if (navigator.mozApps) {
        navigator.mozApps.mgmt.installPackage(data.download);
      } else {
        location.href = data.download;
      }
    };

    uninstallButton.onclick = () => {};
    updateButton.onclick = () => {};

    webappScreenshots.innerHTML = '';
    data.screenshots.forEach(item => {
      var screenshot = document.createElement('img');
      screenshot.src = item;
      webappScreenshots.appendChild(screenshot);
    });

    webappDescription.textContent = data.description;
  }

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== '') {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case 'webapp':
          OrchidServices.get('webapps/' + pair[1]).then(function(data) {
            openInfo(data, pair[1]);
          });
          break;

        default:
          break;
      }
    }
  } else {
    loadContent('home');
  }
})(window);