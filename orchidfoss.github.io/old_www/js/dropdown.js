'use strict';

function dropdown(element, callback) {
  var dropdown = document.createElement('div');
  dropdown.classList.add('dropdown');
  callback(dropdown);
  document.body.appendChild(dropdown);

  element.addEventListener('click', function(e) {
    dropdown.classList.toggle('visible');

    var x = element.getBoundingClientRect().left;
    var y = element.getBoundingClientRect().top + element.getBoundingClientRect().height;
    var width = element.getBoundingClientRect().width;

    if (x > (window.innerWidth - 256)) {
      dropdown.style.left = (x - 256 + width) + 'px';
    } else {
      dropdown.style.left = x + 'px';
    }

    if (y > (window.innerHeight - dropdown.getBoundingClientRect().height)) {
      dropdown.style.top = (y - dropdown.getBoundingClientRect().height) + 'py';
    } else {
      dropdown.style.top = y + 'px';
    }

    var x2 = e.clientX - dropdown.getBoundingClientRect().left;
    var y2 = e.clientY - dropdown.getBoundingClientRect().top;
    dropdown.style.transformOrigin = `${x2}px ${y2}px`;
  });
}
