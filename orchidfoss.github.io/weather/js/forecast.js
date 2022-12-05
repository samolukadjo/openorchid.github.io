(function(exports) {
  'use strict';

  function getTemp(value) {
    var celsius = parseInt(value - 273.15);
    return EnglishToArabicNumerals(isCelsius ?
      (celsius + '°C') :
      (parseInt((celsius * 1.8) + 32) + '°F'))
  }

  function forecast(data) {
    var forecastContainer = document.getElementById('daily-forecast');
    console.log(data);

    data.forEach((item) => {
      var element = document.createElement('li');
      forecastContainer.appendChild(element);

      var iconHolder = document.createElement('div');
      iconHolder.classList.add('icon-holder');
      element.appendChild(iconHolder);

      var icon = document.createElement('img');
      iconHolder.appendChild(icon);

      var context = document.createElement('div');
      context.classList.add('context');
      element.appendChild(context);

      var temparture = document.createElement('p');
      temparture.classList.add('temparture');
      temparture.textContent = 
      element.appendChild(temparture);
    });
  }

  exports.forecast = forecast
})(window);