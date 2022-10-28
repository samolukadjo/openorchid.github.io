function Comments(path, element) {
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

  var currentUrl = location.href;

  var form = element.querySelector('form');
  var inputbox = element.querySelector('form textarea');
  var comments = element.querySelector('ul');

  function refreshComments() {
    OrchidServices.getWithUpdate(path, (data) => {
      comments.innerHTML = '';
      data.comments.forEach((comment, index) => {
        var element = document.createElement('li');
        comments.appendChild(element);

        var figure = document.createElement('figure');
        element.appendChild(figure);

        var figureAvatar = document.createElement('img');
        figure.appendChild(figureAvatar);

        var figCaption = document.createElement('figcaption');
        figure.appendChild(figCaption);

        OrchidServices.get('profile/' + comment.author_id).then(function(udata) {
          figureAvatar.src = udata.profile_picture;
          figureAvatar.alt = udata.username;
          figCaption.textContent = udata.username;

          if (udata.token == comment.author_id) {
            figCaption.classList.add('author');
          }
        });

        var content = document.createElement('p');
        content.textContent = comment.content;
        element.appendChild(content);

        var menu = document.createElement('menu');
        element.appendChild(menu);

        var likeButton = document.createElement('button');
        likeButton.classList.add('like-button');
        likeButton.dataset.icon = 'like';
        likeButton.textContent = EnglishToArabicNumerals(comment.likes.length);
        menu.appendChild(likeButton);

        var dislikeButton = document.createElement('button');
        dislikeButton.classList.add('dislike-button');
        dislikeButton.dataset.icon = 'dislike';
        dislikeButton.textContent = EnglishToArabicNumerals(comment.dislikes.length);
        menu.appendChild(dislikeButton);

        if (comment.likes.indexOf(OrchidServices.userId()) !== -1) {
          likeButton.classList.add('enabled');
        }
        if (comment.dislikes.indexOf(OrchidServices.userId()) !== -1) {
          dislikeButton.classList.add('enabled');
        }

        if (!OrchidServices.isUserLoggedIn()) {
          likeButton.setAttribute('disabled', true);
          dislikeButton.setAttribute('disabled', true);
        }

        likeButton.addEventListener('click', function() {
          if (comment.likes.indexOf(OrchidServices.userId()) === -1) {
            comment.likes.push(OrchidServices.userId());
          } else {
            comment.likes.splice(OrchidServices.userId());
          }

          comment.dislikes.splice(OrchidServices.userId());
          dislikeButton.textContent = EnglishToArabicNumerals(comment.dislikes.length);
          dislikeButton.classList.remove('enabled');

          OrchidServices.get(path).then((data) => {
            data.comments[index].likes = comment.likes;
            data.comments[index].dislikes = comment.dislikes;
            OrchidServices.set(path, { comments: data.comments });
          });
          likeButton.textContent = EnglishToArabicNumerals(comment.likes.length);
          likeButton.classList.toggle('enabled');
        });

        dislikeButton.addEventListener('click', function() {
          if (comment.dislikes.indexOf(OrchidServices.userId()) === -1) {
            comment.dislikes.push(OrchidServices.userId());
          } else {
            comment.dislikes.splice(OrchidServices.userId());
          }

          comment.likes.splice(OrchidServices.userId());
          likeButton.textContent = EnglishToArabicNumerals(comment.likes.length);
          likeButton.classList.remove('enabled');

          OrchidServices.get(path).then((data) => {
            data.comments[index].likes = comment.likes;
            data.comments[index].dislikes = comment.dislikes;
            OrchidServices.set(path, { comments: data.comments });
          });
          dislikeButton.textContent = EnglishToArabicNumerals(comment.dislikes.length);
          dislikeButton.classList.toggle('enabled');
        });
      });
    });
  }

  setTimeout(() => {
    if (location.href == currentUrl) {
      refreshComments();
    }
  }, 100);

  form.addEventListener('submit', (evt) => {
    evt.preventDefault();

    OrchidServices.get(path).then((data) => {
      data.comments.push({
        author_id: OrchidServices.userId(),
        content: inputbox.value,
        likes: [],
        dislikes: []
      });
      OrchidServices.set(path, { comments: data.comments });
      refreshComments();
    });
  });
}