(function (exports) {
  "use strict";

  var tabList = document.getElementById("tablist");
  var tabsContainer = tabList.querySelector('.tablist-tabs');
  var tabs = tabList.querySelectorAll('.tablist-tabs li');
  var viewsContainer = tabList.querySelector('.tablist-views');
  var views = tabList.querySelectorAll('.tablist-views section');

  tabs.forEach((tab, index) => {
    if (index == 0) {
      tab.classList.add('selected');
    }

    tab.addEventListener('click', () => {
      if (tab.getAttribute('for')) {
        views.forEach(view => {
          view.classList.remove('visible');
        });
        tabs.forEach(tab => {
          tab.classList.remove('selected');
        });

        tab.classList.add('selected');
        var selected = viewsContainer.querySelector('#' + tab.getAttribute('for'));
        selected.classList.add('visible');

        viewsContainer.style.height = selected.offsetHeight + 'px';
      }
    });
  });

  views.forEach((view, index) => {
    if (index == 0) {
      view.classList.add('visible');

      viewsContainer.style.height = view.offsetHeight + 'px';
    }
  });
})(window);
