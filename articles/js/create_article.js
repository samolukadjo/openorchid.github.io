(function(exports) {
  'use strict';

  var dialogButton = document.getElementById('create-article-button');

  var dialog = document.getElementById('create-article');
  var titleInput = document.getElementById('create-article-title-input');
  var contentInput = document.getElementById('create-article-content-input');
  var closeButton = document.getElementById('create-article-close-button');
  var submitButton = document.getElementById('create-article-submit-button');

  dialogButton.addEventListener('click', function() {
    dialog.classList.add('visible');
  });
  closeButton.addEventListener('click', function() {
    dialog.classList.remove('visible');
  });

  dialog.addEventListener('submit', function() {
    OrchidServices.custom.publishArticle(
      titleInput.value,
      contentInput.value
    );

    dialog.classList.remove('visible');
  });
})(window);