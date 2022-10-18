(function(exports) {
  'use strict';

  var articleContainer = document.getElementById('articles');

  var article = document.getElementById('article');
  var articleTitle = document.getElementById('article-title');
  var articleAuthorAvatar = document.getElementById('article-author-avatar');
  var articleAuthorUsername = document.getElementById('article-author-username');
  var articleContent = document.getElementById('article-content');

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

    articleAuthorAvatar.onerror = function() {
      articleAuthorAvatar.src = '/images/profile_pictures/avatar_default.svg';
    };

    OrchidServices.get('profile/' + data.author_id).then(function(udata) {
      articleAuthorAvatar.src = udata.profile_picture;
      articleAuthorAvatar.alt = udata.username;
      articleAuthorUsername.textContent = udata.username;
    });
  }
})(window);