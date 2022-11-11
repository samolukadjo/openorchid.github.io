(function() {
  'use strict';

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

  var data;
  var unitMode = 'metric';
  var apiKey = '41afd1424d58cb17007e745f8e0c798b';

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(pos) {
      var client = new XMLHttpRequest();
      client.open('GET', `https://api.openweathermap.org/data/2.5/weather?lat=${pos.coords.latitude}&lon=${pos.coords.longitude}&appid=${apiKey}&lang=${navigator.language}&units=${unitMode}`);
      client.onreadystatechange = () => {
        data = JSON.parse(client.responseText);
        init(pos);
      };
      client.send();
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }

  var heatDegree = document.getElementById('heat-degree');
  var condition = document.getElementById('condition');
  var maps = document.getElementById('maps');
  // var hourlyForecast = document.getElementById('hourly-forecast');
  // var dailyForecast = document.getElementById('daily-forecast');
  var feelsLike = document.getElementById('feels-like');
  var tempMin = document.getElementById('temp-min');
  var tempMax = document.getElementById('temp-max');
  var pressure = document.getElementById('pressure');
  var humidity = document.getElementById('humidity');

  function getTemp(value) {
    var celsius = parseInt(value);
    return EnglishToArabicNumerals(unitMode === 'metric' ?
      (celsius + '°C') :
      (celsius + '°F'));
  }

  function init(pos) {
    heatDegree.textContent = getTemp(data.main.temp);
    condition.textContent = data.weather[0].description;
    maps.src = `https://www.openstreetmap.org/export/embed.html?bbox=27.751464843750004%2C26.509904531413927%2C57.41455078125001%2C39.65645604812829&layer=mapnik&marker=${pos.coords.latitude}%2C${pos.coords.longitude}`;

    feelsLike.dataset.l10nArgs = '{"n": "' + getTemp(data.main.feels_like) + '"}';
    tempMin.dataset.l10nArgs = '{"n": "' + getTemp(data.main.temp_min) + '"}';
    tempMax.dataset.l10nArgs = '{"n": "' + getTemp(data.main.temp_max) + '"}';
    pressure.dataset.l10nArgs = '{"n": "' + data.main.pressure + '"}';
    humidity.dataset.l10nArgs = '{"n": "' + data.main.humidity + '"}';
  }
})();