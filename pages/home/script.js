var postWhitelist = [
  '70edbdb3-51f4-442a-a579-bf34c3bc9adf'
];
var antiDupe = [];

var cards = document.getElementById('cards');

cards.innerHTML = '';
OrchidServices.getList('articles', (article) => {
  if (postWhitelist.indexOf(article.author_id) !== 0) {
    return;
  }

  if (antiDupe.indexOf(article.token) !== -1) {
    return;
  }
  antiDupe.push(article.token);

  var element = document.createElement('a');
  element.href = 'https://orchidfoss.github.io/articles/?post=' + article.token;
  cards.appendChild(element);

  var image = document.createElement('img');
  element.appendChild(image);

  var textHolder = document.createElement('div');
  element.appendChild(textHolder);

  var title = document.createElement('h1');
  textHolder.appendChild(title);

  var content = document.createElement('p');
  content.textContent = article.content;
  textHolder.appendChild(content);

  var learnMoreLabel = document.createElement('span');
  learnMoreLabel.dataset.l10nId = 'learn-more';
  textHolder.appendChild(learnMoreLabel);

  OrchidServices.getWithUpdate('profile/' + article.author_id, (data) => {
    image.src = article.images[0] || data.profile_picture;
    title.textContent = data.username;
  });
});
