(function(exports) {
  'use strict';

  function EnglishToArabicNumerals(numberString) {
    var arabicNumerals = ['٠','١','٢','٣','٤','٥','٦','٧','٨','٩'];
    if (document.dir == 'rtl') {
      return numberString.toString().replace(/[0-9]/g, function(w) {
        return arabicNumerals[+w];
      });
    } else {
      return numberString;
    }
  }

  var articlesList = [];
  var articleContainer = document.getElementById('articles');

  var homeButton = document.getElementById('home-button');
  var articles = document.getElementById('articles');
  var article = document.getElementById('article');
  var articleTitle = document.getElementById('article-title');
  var articleAuthorAvatar = document.getElementById('article-author-avatar');
  var articleAuthorUsername = document.getElementById('article-author-username');
  var articleContent = document.getElementById('article-content');
  var articleComments = document.getElementById('comments');

  homeButton.addEventListener('click', () => {
    article.classList.remove('visible');
    window.history.pushState({"html":'',"pageTitle":''}, "", '/articles/');
    articles.style.display = '';
  });

  var likeButton = document.getElementById('like-button');
  var dislikeButton = document.getElementById('dislike-button');

  OrchidServices.getList('articles', function(article) {
    articlesList.push(article);
    articlesList.sort((a, b) => {
      if (a.likes < b.likes) {
        return 1;
      }
      if (a.likes > b.likes) {
        return -1;
      }
      // a must be equal to b
      return 0;
    });

    articleContainer.innerHTML = '';
    articlesList.forEach(function(article) {
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
  });

  function openArticle(data) {
    articles.style.display = 'none';
    article.classList.add('visible');
    articleTitle.textContent = data.title;
    articleContent.innerHTML = markdownit().render(data.content);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });

    window.history.pushState({"html":'',"pageTitle":''}, "", '?article=' + data.token);

    likeButton.children[0].textContent = EnglishToArabicNumerals(data.likes.length);
    dislikeButton.children[0].textContent = EnglishToArabicNumerals(data.dislikes.length);

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
      dislikeButton.children[0].textContent = EnglishToArabicNumerals(data.dislikes.length);
      dislikeButton.classList.remove('enabled');

      OrchidServices.set('articles/' + data.token, { likes: data.likes, dislikes: data.dislikes });
      likeButton.children[0].textContent = EnglishToArabicNumerals(data.likes.length);
      likeButton.classList.toggle('enabled');
    });

    dislikeButton.addEventListener('click', function() {
      if (data.dislikes.indexOf(OrchidServices.userId()) === -1) {
        data.dislikes.push(OrchidServices.userId());
      } else {
        data.dislikes.splice(OrchidServices.userId());
      }

      data.likes.splice(OrchidServices.userId());
      likeButton.children[0].textContent = EnglishToArabicNumerals(data.likes.length);
      likeButton.classList.remove('enabled');

      OrchidServices.set('articles/' + data.token, { likes: data.likes, dislikes: data.dislikes });
      dislikeButton.children[0].textContent = EnglishToArabicNumerals(data.dislikes.length);
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

    Comments('articles/' + data.token, articleComments);
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