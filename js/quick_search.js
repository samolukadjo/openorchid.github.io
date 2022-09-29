(function(exports) {
  'use strict';

  var history = [];

  var searchHistory = localStorage.getItem('ws.searchHistory');
  if (searchHistory) {
    history = JSON.parse(searchHistory);
  }

  var searchForm = document.getElementById('quick-search-form');
  var searchResults = document.getElementById('quick-search-results');
  var searchInput = document.getElementById('quick-search-input');

  searchForm.addEventListener('submit', evt => {
    evt.preventDefault();
    if (searchInput.value !== '') {
      history.push(searchInput.value);
      localStorage.setItem('ws.searchHistory', JSON.stringify(history));
    }
  });

  history.reverse().forEach((item, index) => {
    if (index <= 24) {
      var link = document.createElement('a');
      link.href = '/search/?query=' + item;
      link.dataset.icon = 'history';
      link.textContent = item;
      searchResults.appendChild(link);
    }
  })
})(window);