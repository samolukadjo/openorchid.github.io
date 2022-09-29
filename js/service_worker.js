(function(exports) {
  'use strict';

  var serviceWorkerState = localStorage.getItem('ws.serviceWorkerState');
  var dialog = document.getElementById('service-worker-dialog');
  var denyButton = document.getElementById('service-worker-dialog-deny');
  var allowButton = document.getElementById('service-worker-dialog-allow');

  dialog.classList.toggle('visible', serviceWorkerState !== 'denied' && serviceWorkerState !== 'allowed');

  denyButton.addEventListener('click', function() {
    dialog.classList.remove('visible');
    localStorage.setItem('ws.serviceWorkerState', 'denied');
  });
  allowButton.addEventListener('click', function() {
    dialog.classList.remove('visible');
    localStorage.setItem('ws.serviceWorkerState', 'allowed');
  });
})(window);