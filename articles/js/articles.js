(function(exports) {
  'use strict';

  var articleContainer = document.getElementById('articles');

  var article = document.getElementById('article');
  var articleTitle = document.getElementById('article-title');
  var articleAuthorAvatar = document.getElementById('article-author-avatar');
  var articleAuthorUsername = document.getElementById('article-author-username');
  var articleContent = document.getElementById('article-content');

  var likeButton = document.getElementById('like-button');
  var dislikeButton = document.getElementById('dislike-button');

  OrchidServices.getList('articles', function(article) {
    var element = document.createElement('article');
    element.classList.add('article');
    element.addEventListener('click', function() {
      openArticle(article);
    });
    articleContainer.appendChild(element);

    var title = document.createElement('h1');
    title.textContent = article.title;
    element.appendChild(title);

    var figure = document.createElement('figure');
    element.appendChild(figure);

    var figIcon = document.createElement('img');
    figIcon.onerror = function() {
      figIcon.src = '/images/profile_pictures/avatar_default.svg';
    };
    figure.appendChild(figIcon);

    var figcaption = document.createElement('figcaption');
    figure.appendChild(figcaption);

    OrchidServices.get('profile/' + article.author_id).then(function(udata) {
      figIcon.src = udata.profile_picture;
      figIcon.alt = udata.username;
      figcaption.textContent = udata.username;
    });
  });

  function openArticle(data) {
    article.classList.add('visible');
    articleTitle.textContent = data.title;
    articleContent.innerHTML = markdownit().render(data.content);

    window.history.pushState({"html":'',"pageTitle":''}, "", '?article=' + data.token);

    likeButton.textContent = data.likes.length;
    dislikeButton.textContent = data.dislikes.length;

    if (data.likes.indexOf(OrchidServices.userId()) !== -1) {
      likeButton.classList.add('enabled');
    }
    if (data.dislikes.indexOf(OrchidServices.userId()) !== -1) {
      dislikeButton.classList.add('enabled');
    }

    if (!OrchidServices.isUserLoggedIn()) {
      likeButton.setAttribute('disabled', true);
      dislikeButton.setAttribute('disabled', true);
    }

    likeButton.addEventListener('click', function() {
      if (data.likes.indexOf(OrchidServices.userId()) === -1) {
        data.likes.push(OrchidServices.userId());
      } else {
        data.likes.splice(OrchidServices.userId());
      }

      data.dislikes.splice(OrchidServices.userId());
      dislikeButton.textContent = data.dislikes.length;
      dislikeButton.classList.remove('enabled');

      OrchidServices.set('articles/' + data.token, { likes: data.likes, dislikes: data.dislikes });
      likeButton.textContent = data.likes.length;
      likeButton.classList.toggle('enabled');
    });

    dislikeButton.addEventListener('click', function() {
      if (data.dislikes.indexOf(OrchidServices.userId()) === -1) {
        data.dislikes.push(OrchidServices.userId());
      } else {
        data.dislikes.splice(OrchidServices.userId());
      }

      data.likes.splice(OrchidServices.userId());
      likeButton.textContent = data.likes.length;
      likeButton.classList.remove('enabled');

      OrchidServices.set('articles/' + data.token, { likes: data.likes, dislikes: data.dislikes });
      dislikeButton.textContent = data.dislikes.length;
      dislikeButton.classList.toggle('enabled');
    });

    articleAuthorAvatar.onerror = function() {
      articleAuthorAvatar.src = '/images/profile_pictures/avatar_default.svg';
    };

    OrchidServices.get('profile/' + data.author_id).then(function(udata) {
      articleAuthorAvatar.src = udata.profile_picture;
      articleAuthorAvatar.alt = udata.username;
      articleAuthorUsername.textContent = udata.username;
    });
  }

  var paramString = location.search.substring(1);
  var queryString = new URLSearchParams(paramString);
  if (location.search !== '') {
    for (let pair of queryString.entries()) {
      switch (pair[0]) {
        case 'article':
          OrchidServices.get('articles/' + pair[1]).then(function(data) {
            openArticle(data);
          });
          break;

        default:
          break;
      }
    }
  }
})(window);