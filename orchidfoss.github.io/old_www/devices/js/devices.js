'use strict';

import { database, loginId, getDBItem, setDBItem } from "/js/firebase.js";
import { ref, onValue } from "https://www.gstatic.com/firebasejs/9.8.3/firebase-database.js";

(function() {
  var isDarkMode = (localStorage.getItem('dark_mode') === 'true');
  if (isDarkMode) {
    document.body.classList.add('dark-mode-enabled');
  }

  var identifier = (navigator.appCodeName + navigator.appName + navigator.deviceMemory + window.outerWidth + window.outerHeight + navigator.platform).replaceAll(' ', '').toLowerCase();
  var deviceContainer = document.getElementById('devices');

  document.body.addEventListener('paste', function(event) {
    var cb = event.clipboardData;
    if(cb.types.indexOf("text/html") != -1) {
      var pastedContent = cb.getData("text/html");
    } else if(cb.types.indexOf("text/html") != -1) {
      var pastedContent = cb.getData("text/html");
    } else {
      var pastedContent = cb.getData(cb.types[0]);
    }

    setDBItem('users/' + loginId + '/clipboard', pastedContent);
  });

  onValue(ref(database, 'users/' + loginId + '/devices'), function(snapshot) {
    const data = snapshot.val();
    var entries = Object.entries(data);

    deviceContainer.innerHTML = '';
    entries.forEach(function(entry) {
      var device = document.createElement('div');
      device.classList.add('device');
      if (entry[0] == identifier) {
        device.classList.add('current');
      }

      var image = document.createElement('img');
      image.src = entry[1].image || 'images/device.svg';
      device.appendChild(image);

      var title = document.createElement('h1');
      getDBItem('users/' + loginId + '/username', function(data) {
        if (/Windows|Mac|Linux|WOS Desktop/i.test(entry[1].userAgent)) {
          title.dataset.l10nId = 'user-desktop';
        } else if (/Android|iPhone|WOS|Nutria/i.test(entry[1].userAgent)) {
          title.dataset.l10nId = 'user-phone';
        } else if (/SmartTV|WOS TV/i.test(entry[1].userAgent)) {
          title.dataset.l10nId = 'user-tv';
        }
        title.dataset.l10nArgs = '{"username": "' + entry[1].name + '"}';
      });
      device.appendChild(title);

      var model = document.createElement('p');
      model.innerText = entry[1].model;
      device.appendChild(model);

      var icons = document.createElement('div');
      icons.classList.add('icons');
      device.appendChild(icons);

      var battery = document.createElement('span');
      battery.dataset.icon = 'battery-' + (parseInt(entry[1].battery * 10) * 10);
      icons.appendChild(battery);

      if (entry[1].wifi == 0) {
        var wifi = document.createElement('span');
        wifi.dataset.icon = 'wifi-' + parseInt(entry[1].wifi * 25);
        icons.appendChild(wifi);
      }

      deviceContainer.appendChild(device);
    });
  });
})();
