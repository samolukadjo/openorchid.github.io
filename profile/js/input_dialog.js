(function (exports) {
  "use strict";

  function InputDialog(id, pretype = '', callback) {
    var dialog = document.getElementById(id);
    var form = dialog.querySelector('form');
    var input = document.getElementById(id + '-input');
    var closeButton = document.getElementById(id + '-close');
    var confirmButton = document.getElementById(id + '-confirm');

    dialog.classList.add('visible');
    input.value = pretype;

    closeButton.onclick = (evt) => {
      evt.preventDefault();
      dialog.classList.remove('visible');
    };

    form.onsubmit = (evt) => {
      evt.preventDefault();
    };

    confirmButton.onclick = (evt) => {
      evt.preventDefault();
      dialog.classList.remove('visible');
      callback(input.value);
    };
  }

  window.InputDialog = InputDialog;
})(window);
