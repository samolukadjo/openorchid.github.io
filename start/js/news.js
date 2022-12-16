(function() {
  'use strict';

  moment.locale(navigator.language);

  Date.prototype.yyyymmdd = function() {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [this.getFullYear(),
      (mm>9 ? '' : '0') + mm,
      (dd>9 ? '' : '0') + dd
    ].join('');
  };

  var data = {};
  var newsContainer = document.getElementById('widgets-news');

  var date = new Date();
  var lastMonth = date.getFullYear() + '-' + date.getMonth() + '-' + date.getUTCDate();
  console.log('Last month was at ' + lastMonth);

  var client = new XMLHttpRequest();
  client.open('GET', 'https://newsapi.org/v2/everything?q=news&from=' + lastMonth + '&language=en&sortBy=publishedAt&apiKey=4930e7035f9e4bcca838a594141153f9');
  client.onreadystatechange = function() {
    data = JSON.parse(client.responseText);
    init();
  }
  client.send();

  function init() {
    newsContainer.innerHTML = '';

    data.articles.forEach(function(article, index) {
      var element = document.createElement('li');
      var image = document.createElement('img');
      var textHolder = document.createElement('div');
      var timestamp = document.createElement('span');
      var title = document.createElement('h1');
      var author = document.createElement('span');
      var source = document.createElement('p');

      element.onclick = function() {
        location.href = article.url;
      };
      element.classList.add('widget');

      image.src = article.urlToImage;
      image.loading = 'lazy';
      element.appendChild(image);

      element.appendChild(textHolder);

      var dateString = new Date(article.publishedAt).yyyymmdd();

      timestamp.textContent = moment(dateString, 'YYYYMMDD').fromNow();
      timestamp.classList.add('date');
      textHolder.appendChild(timestamp);

      title.textContent = article.title;
      title.classList.add('title')
      textHolder.appendChild(title);

      author.textContent = article.author;
      author.classList.add('author')
      textHolder.appendChild(author);

      source.innerText = article.source.name;
      source.classList.add('source');
      textHolder.appendChild(source);

      newsContainer.appendChild(element);
    });
  }
})();
